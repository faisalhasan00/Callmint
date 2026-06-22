try:
    from app.tasks.celery_app import celery_app
except Exception:
    celery_app = None

from sqlalchemy.orm import Session
import time

from app.core.db import SessionLocal
from app.core.config import settings
from app.models.models import Campaign, Customer, CallLog, Business

def launch_campaign_task(campaign_id: int):
    """
    Asynchronously triggers outbound Twilio calls for all customers mapped to a campaign.
    """
    db = SessionLocal()
    try:
        campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
        if not campaign:
            print(f"Campaign {campaign_id} not found.")
            return
            
        business = db.query(Business).filter(Business.id == campaign.business_id).first()
        
        # Build query to retrieve target customers
        query = db.query(Customer).filter(Customer.business_id == campaign.business_id)
        
        if campaign.target_date_start:
            query = query.filter(Customer.created_at >= campaign.target_date_start)
        if campaign.target_date_end:
            query = query.filter(Customer.created_at <= campaign.target_date_end)
            
        # If this is a Subscription Renewal campaign, target customers whose subscription has expired or is null
        if campaign.type == "Subscription Renewal":
            from datetime import datetime
            query = query.filter((Customer.subscription_end_date == None) | (Customer.subscription_end_date < datetime.utcnow()))
            
        customers = query.all()
        
        print(f"Launching campaign '{campaign.name}' for {len(customers)} targeted customers.")
        
        if not settings.EXOTEL_ACCOUNT_SID or not settings.EXOTEL_API_KEY or not settings.EXOTEL_API_TOKEN:
            print("Exotel credentials missing. Running mock campaign trigger.")
            # Mock dial: Log calls immediately
            for customer in customers:
                db_call = CallLog(
                    business_id=campaign.business_id,
                    customer_id=customer.id,
                    direction="outbound",
                    status="completed",
                    recording_url=None,
                    transcript=f"Assistant: Namaste {customer.name}. {business.name} has a promotional campaign active: {campaign.name}.\nCustomer: Thank you, I will check it out.",
                    duration_seconds=45
                )
                db.add(db_call)
            campaign.status = "Completed"
            db.commit()
            return
            
        import httpx
        
        # Connect each customer to the Exotel Voicebot flow
        for customer in customers:
            try:
                # Clean phone number to E.164 (remove spaces/dashes)
                clean_phone = customer.phone.replace(" ", "").replace("-", "")
                
                # Resolve callback public domain (ngrok or deployed URL)
                if settings.PUBLIC_URL:
                    base_url = settings.PUBLIC_URL.rstrip("/")
                else:
                    base_url = f"http://{settings.HOST}:{settings.PORT}"
                
                callback_url = f"{base_url}/api/v1/exotel/inbound"
                
                # Derive WebSocket URL for Exotel Voicebot Stream
                ws_scheme = "wss" if base_url.startswith("https") else "ws"
                ws_base = base_url.replace("https://", "").replace("http://", "")
                stream_url = f"{ws_scheme}://{ws_base}/api/v1/exotel/stream/{business.id}/{customer.id}"
                
                # Exotel Outbound Connect API Endpoint
                # https://api.exotel.com/v1/Accounts/{sid}/Calls/connect.json
                exotel_url = f"https://api.exotel.com/v1/Accounts/{settings.EXOTEL_ACCOUNT_SID}/Calls/connect.json"
                
                # Exotel requires us to route the call to a Voicebot Applet which handles the WebSocket stream.
                # The user's Applet ID is 1271167.
                applet_url = f"http://my.exotel.com/{settings.EXOTEL_ACCOUNT_SID}/exoml/start_voice/1271167"
                
                payload = {
                    "From": clean_phone,
                    "CallerId": settings.EXOTEL_PHONE_NUMBER,
                    "Url": applet_url,
                    "CallType": "trans",
                    "StatusCallback": callback_url,
                    "CustomField": str(campaign.id)
                }
                
                # Exotel API uses Basic Auth with (API_KEY, API_TOKEN)
                response = httpx.post(
                    exotel_url,
                    auth=(settings.EXOTEL_API_KEY, settings.EXOTEL_API_TOKEN),
                    data=payload,
                    timeout=10.0
                )
                
                if response.status_code in [200, 201]:
                    data = response.json()
                    call_sid = data.get("Call", {}).get("Sid")
                    print(f"Triggered Exotel call to {customer.phone}, Call SID: {call_sid}")
                    
                    # Create initial outbound call log record
                    db_call = CallLog(
                        business_id=campaign.business_id,
                        customer_id=customer.id,
                        direction="outbound",
                        status="ringing",
                        duration_seconds=0
                    )
                    db.add(db_call)
                    db.commit()
                else:
                    print(f"Failed to trigger Exotel call for {customer.phone}: {response.text}")
                    
            except Exception as call_err:
                print(f"Error triggering Exotel call to {customer.phone}: {call_err}")
                
        campaign.status = "Completed"
        db.commit()
        
    except Exception as e:
        print(f"Error executing campaign task: {e}")
    finally:
        db.close()
