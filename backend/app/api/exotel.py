from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, Request, Response
import asyncio
from sqlalchemy.orm import Session
import json
import base64
import time
import math

from app.core.db import get_db
from app.core.config import settings
from app.models.models import Business, Subscription, CallLog, UsageLog, Customer
from app.services.agent import VoiceAIAgent
from app.services.audio import synthesize_speech, transcribe_audio_chunk

router = APIRouter(prefix="/exotel", tags=["Exotel Media Streams & Webhooks"])

@router.api_route("/inbound", methods=["GET", "POST"])
async def inbound_call(request: Request, db: Session = Depends(get_db)):
    """
    Exotel webhook handler for incoming calls.
    Validates phone mapping, loads the tenant business ID, and returns
    the WebSocket connection URL for Exotel's Voicebot Applet.
    Supports both GET and POST requests.
    """
    # Parse parameters depending on request method
    print("====== EXOTEL INBOUND CALL RECEIVED ======")
    print(f"Request Method: {request.method}")
    print(f"Request URL: {request.url}")
    if request.method == "POST":
        form_data = await request.form()
        to_number = form_data.get("To", form_data.get("CallTo", ""))
        from_number = form_data.get("From", form_data.get("CallFrom", ""))
        call_sid = form_data.get("CallSid", "")
        custom_field = form_data.get("CustomField", "")
    else:
        # GET request
        to_number = request.query_params.get("To", request.query_params.get("CallTo", ""))
        from_number = request.query_params.get("From", request.query_params.get("CallFrom", ""))
        call_sid = request.query_params.get("CallSid", "")
        custom_field = request.query_params.get("CustomField", "")
    
    print(f"Parsed Params -> To: {to_number}, From: {from_number}, CallSid: {call_sid}, CustomField: {custom_field}")
    
    # Resolve the first registered business as default tenant fallback
    business = db.query(Business).first()
    
    if not business:
        return Response(content="Error: No registered business.", media_type="text/plain", status_code=400)
        
    # Build or find customer in CRM based on From number
    customer = db.query(Customer).filter(
        Customer.phone == from_number,
        Customer.business_id == business.id
    ).first()
    if not customer:
        customer = Customer(
            business_id=business.id,
            name=f"Caller {from_number[-4:]}",
            phone=from_number,
            preferred_language="Hinglish"
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)

    # Resolve websocket host scheme
    host = request.url.netloc
    scheme = "wss" if request.url.scheme == "https" else "ws"
    ws_url = f"{scheme}://{host}/api/v1/exotel/stream/{business.id}/{customer.id}"
    
    # If this is an outbound call triggered by a Campaign, pass the campaign_id down!
    if custom_field and custom_field.isdigit():
        ws_url += f"?campaign_id={custom_field}"
    
    # Create initial ringing call log
    call_log = CallLog(
        business_id=business.id,
        customer_id=customer.id,
        direction="inbound",
        status="ringing",
        duration_seconds=0
    )
    db.add(call_log)
    db.commit()
    
    # Return WebSocket URL for dynamic Voicebot Applet routing
    print(f"Returning JSON Response: {{'url': '{ws_url}'}}")
    return {"url": ws_url}


@router.websocket("/stream/{business_id}/{customer_id}")
async def exotel_audio_stream(
    websocket: WebSocket, 
    business_id: int, 
    customer_id: int,
    campaign_id: int = None,
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint handling real-time duplex media streaming for Exotel calls.
    Bridges Exotel audio input (16-bit PCM 8kHz) -> STT -> Agent LLM -> TTS -> Exotel audio output.
    """
    print(f"====== WEBSOCKET STREAM REQUESTED: Business {business_id}, Customer {customer_id}, Campaign {campaign_id} ======")
    await websocket.accept()
    print("WebSocket connection accepted.")
    
    # Initialize voice agent with optional campaign context
    agent = VoiceAIAgent(business_id=business_id, db=db, campaign_id=campaign_id)
    
    stream_sid = None
    call_start_time = time.time()
    session_history = []
    audio_buffer = bytearray()
    
    if campaign_id and agent.campaign:
        greeting_text = f"Namaste, main {agent.business.name} se baat kar raha hoon. Ek important update thi, kya abhi baat karne ka sahi samay hai?"
    else:
        greeting_text = agent.ai_config.custom_greeting if agent.ai_config else f"Namaste. {agent.business.name} mein aapka swagat hai. Main aapki kis tarah madad kar sakta hoon?"
    
    try:
        while True:
            message_text = await websocket.receive_text()
            data = json.loads(message_text)
            event = data.get("event")
            
            if event != "media":
                print(f"\n[WS EVENT] {event.upper()} received.")
                
            if event == "connected":
                # Connection established event
                print("Exotel Client Connected.")
                
            elif event == "start":
                stream_sid = data.get("stream_sid")
                print(f"Exotel Call Started: Stream SID {stream_sid}")
                
                # Immediately synthesize and send greeting in PCM 8kHz format
                greeting_audio = await asyncio.to_thread(
                    synthesize_speech, 
                    greeting_text, 
                    agent.ai_config.voice_style if agent.ai_config else "Professional Female"
                )
                # Exotel drops large websocket frames. We MUST chunk the audio into 320 byte packets!
                chunk_size = 320
                for i in range(0, len(greeting_audio), chunk_size):
                    chunk = greeting_audio[i:i+chunk_size]
                    media_payload = {
                        "event": "media",
                        "stream_sid": stream_sid,
                        "media": {
                            "payload": base64.b64encode(chunk).decode("utf-8")
                        }
                    }
                    await websocket.send_text(json.dumps(media_payload))
                    await asyncio.sleep(0.01)
                session_history.append({"role": "assistant", "content": greeting_text})
                
            elif event == "media":
                # Exotel incoming audio payload (raw base64-encoded PCM)
                payload_b64 = data.get("media", {}).get("payload")
                if payload_b64:
                    chunk = base64.b64decode(payload_b64)
                    audio_buffer.extend(chunk)
                    
                    # Process every ~2.5 seconds of audio (8000 Hz * 2 bytes/sample * 2.5 sec = 40000 bytes)
                    if len(audio_buffer) >= 40000:
                        transcript = await asyncio.to_thread(transcribe_audio_chunk, bytes(audio_buffer))
                        audio_buffer.clear()
                        
                        if transcript and transcript.strip():
                            print(f"\n🗣️ [CUSTOMER]: {transcript}")
                            session_history.append({"role": "user", "content": transcript})
                            
                            response_text, action = await asyncio.to_thread(agent.process_message, transcript, session_history)
                            print(f"🤖 [AI AGENT]: {response_text} (Action: {action})")
                            session_history.append({"role": "assistant", "content": response_text})
                            
                            # Synthesize response
                            response_audio = await asyncio.to_thread(
                                synthesize_speech, 
                                response_text, 
                                agent.ai_config.voice_style if agent.ai_config else "Professional Female"
                            )
                            
                            # Exotel drops large websocket frames. We MUST chunk the audio into 320 byte packets!
                            chunk_size = 320
                            for i in range(0, len(response_audio), chunk_size):
                                chunk = response_audio[i:i+chunk_size]
                                media_payload = {
                                    "event": "media",
                                    "stream_sid": stream_sid,
                                    "media": {
                                        "payload": base64.b64encode(chunk).decode("utf-8")
                                    }
                                }
                                await websocket.send_text(json.dumps(media_payload))
                                await asyncio.sleep(0.01)
                
            elif event == "dtmf":
                digit = data.get("dtmf", {}).get("digit")
                print(f"[WS] DTMF Key Pressed: {digit}")
                
            elif event == "text_simulation":
                # Development/testing text simulation
                user_input = data.get("text")
                print(f"Call Simulation Input: {user_input}")
                
                response_text, action = agent.process_message(user_input, session_history)
                print(f"Agent Response: {response_text} [Action: {action}]")
                
                response_audio = synthesize_speech(response_text, agent.ai_config.voice_style if agent.ai_config else "Professional Female")
                base64_audio = base64.b64encode(response_audio).decode("utf-8")
                
                media_payload = {
                    "event": "media",
                    "stream_sid": stream_sid,
                    "media": {
                        "payload": base64_audio
                    }
                }
                await websocket.send_text(json.dumps(media_payload))
                
                session_history.append({"role": "user", "content": user_input})
                session_history.append({"role": "assistant", "content": response_text})
                
            elif event == "stop":
                print("\n🔴 [CALL ENDED] Exotel Call Stop event received.")
                break
                
    except WebSocketDisconnect:
        print("Exotel WebSocket connection disconnected.")
    except Exception as e:
        print(f"Error in Exotel WebSocket stream handler: {e}")
    finally:
        # Calculate call metrics and deduct billing minutes
        call_end_time = time.time()
        duration_seconds = int(call_end_time - call_start_time)
        
        # Round up to next minute (minimum 1 minute)
        minutes_charged = math.ceil(duration_seconds / 60)
        if minutes_charged < 1:
            minutes_charged = 1
            
        print(f"\n📊 [CALL SUMMARY]")
        print(f"   Business ID: {business_id} | Customer ID: {customer_id}")
        print(f"   Duration: {duration_seconds}s | Charged: {minutes_charged} min")
        
        full_transcript = ""
        print("\n📜 [FULL TRANSCRIPT]")
        for turn in session_history:
            role = turn["role"].upper()
            content = turn["content"]
            full_transcript += f"{role}: {content}\n"
            print(f"{role}: {content}")
        print("==================================================================\n")
            
        # Create CallLog
        db_call = CallLog(
            business_id=business_id,
            customer_id=customer_id,
            direction="inbound",
            status="completed",
            duration_seconds=duration_seconds,
            transcript=full_transcript
        )
        db.add(db_call)
        db.commit()
        db.refresh(db_call)
        
        # Update Subscription used minutes
        sub = db.query(Subscription).filter(Subscription.business_id == business_id).first()
        if sub:
            sub.minutes_used += minutes_charged
            
            # Write billing UsageLog
            db_usage = UsageLog(
                business_id=business_id,
                call_log_id=db_call.id,
                minutes_charged=float(minutes_charged),
                cost=0.0
            )
            db.add(db_usage)
            db.commit()
            
        try:
            await websocket.close()
        except:
            pass
