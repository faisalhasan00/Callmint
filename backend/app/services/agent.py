import json
import re
from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from app.models.models import Customer, Appointment, Offer, Business, AIConfig, Campaign
from app.core.config import settings

class VoiceAIAgent:
    """
    Conversational Agent handling multi-lingual intent mapping (Hindi, Telugu, Hinglish)
    for Salon and SuperMart customer interactions. Integrates with LLM (OpenAI)
    and falls back to rule-based dialog if API key is not present.
    """
    
    def __init__(self, business_id: int, db: Session, campaign_id: int = None):
        self.business_id = business_id
        self.db = db
        self.campaign_id = campaign_id
        self.business = db.query(Business).filter(Business.id == business_id).first()
        self.ai_config = db.query(AIConfig).filter(AIConfig.business_id == business_id).first()
        
        self.campaign = None
        if campaign_id:
            self.campaign = db.query(Campaign).options(joinedload(Campaign.offer)).filter(Campaign.id == campaign_id).first()
        
        
        # Load business listings
        self.services = []
        self.timings = "9:00 AM to 8:00 PM"
        if self.business:
            self.timings = f"{self.business.timings_open} to {self.business.timings_close}"
            if self.business.type == "Salon":
                self.services = ["Haircut", "Beard Styling", "Hair Spa", "Facial"]
            else:
                self.services = ["Grocery Items", "Fresh Produce", "Daily Essentials"]
                
    def get_system_prompt(self, detected_language: str) -> str:
        business_name = self.business.name if self.business else "our shop"
        business_type = self.business.type if self.business else "retail"
        
        # Base system prompt
        system_prompt = self.ai_config.custom_system_prompt if self.ai_config and self.ai_config.custom_system_prompt else f"""
        You are a human-like voice receptionist for {business_name}, a {business_type}.
        Your goal is to assist the customer politely, keeping your answers very short (1-2 sentences max).
        You speak and understand: Hindi, Telugu, and Hinglish.
        You must respond in {detected_language}.
        
        Business Timings: {self.timings}.
        Available Services/Departments: {', '.join(self.services)}.
        """

        # Append Campaign Goal if this is an outbound campaign call
        if self.campaign:
            system_prompt += f"\n\n--- CRITICAL CAMPAIGN GOAL ---\n"
            system_prompt += f"You are currently making an outbound call for a campaign named '{self.campaign.name}' (Type: {self.campaign.type}).\n"
            
            if self.campaign.custom_prompt:
                system_prompt += f"USER'S CUSTOM INSTRUCTION FOR THIS CALL: {self.campaign.custom_prompt}\n"
                
            if self.campaign.offer:
                system_prompt += f"PROMOTIONAL OFFER TO MENTION: {self.campaign.offer.title} - {self.campaign.offer.discount_percentage}% OFF. {self.campaign.offer.description or ''}\n"
                
            system_prompt += "Ensure your conversation naturally brings up this campaign goal. Keep it polite, human-like, and do not sound robotic.\n"

        # Append standard rules
        system_prompt += """
        Rules:
        1. Keep responses short and conversational.
        2. Never say "I am an AI assistant". Sound like a real shop employee.
        3. Guide the customer step by step.
        4. If the customer gets angry or asks for a manager, say: "Main aapki call hamare team member ko transfer kar raha hoon." (Human Hand-off)
        """
        
        return system_prompt

    def process_message(self, user_text: str, session_history: list, customer_phone: str = None) -> tuple[str, str]:
        """
        Processes incoming customer text.
        Returns:
            (response_text, action)
            Where action can be "none", "book_appointment", "cancel_appointment", "human_transfer"
        """
        # 1. Detect language (Rule-based simple heuristic or default fallback)
        detected_lang = "Hinglish"
        has_telugu = any(word in user_text.lower() for word in ["namskaram", "eppudu", "avunu", "ledu", "lanti", "enti"])
        has_hindi = any(word in user_text.lower() for word in ["kab", "haan", "nahi", "kya", "shubh", "shukriya"])
        
        if has_telugu:
            detected_lang = "Telugu"
        elif has_hindi:
            detected_lang = "Hindi"

        # 2. Check for human transfer requests
        transfer_keywords = ["manager", "owner", "gussa", "angry", "transfer", "complaint", "talk to human"]
        if any(kw in user_text.lower() for kw in transfer_keywords):
            transfer_msg = {
                "Hindi": "Main aapki call hamare team member ko transfer kar raha hoon.",
                "Telugu": "నేను మీ కాల్ ని మా ప్రతినిధి కి బదిలీ చేస్తున్నాను.",
                "Hinglish": "Main aapki call hamare team member ko transfer kar raha hoon."
            }
            return transfer_msg.get(detected_lang, transfer_msg["Hinglish"]), "human_transfer"

        # 3. LLM API call if OpenAI Key is configured
        if settings.OPENAI_API_KEY:
            try:
                import openai
                client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
                
                messages = [{"role": "system", "content": self.get_system_prompt(detected_lang)}]
                # Add past history chunks
                for hist in session_history[-6:]:
                    messages.append(hist)
                messages.append({"role": "user", "content": user_text})
                
                # We can also attach a functional tool description for booking slots
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    temperature=0.4,
                    max_tokens=80
                )
                ai_text = response.choices[0].message.content.strip()
                
                # Check for booking actions from the text response
                action = "none"
                if "success" in ai_text.lower() or "confirm" in ai_text.lower() or "book" in ai_text.lower():
                    if "appointment" in user_text.lower() or "haircut" in user_text.lower() or "booking" in user_text.lower():
                        action = "book_appointment"
                return ai_text, action
            except Exception as e:
                # Log error and proceed to Gemini fallback
                print(f"OpenAI Call Failed, falling back to Gemini agent: {e}")

        # 4. LLM API call if Gemini Key is configured (Fallback after OpenAI)
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                
                # Configure the Gemini model with system instruction
                model = genai.GenerativeModel(
                    'gemini-1.5-flash',
                    system_instruction=self.get_system_prompt(detected_lang)
                )
                
                gemini_history = []
                for hist in session_history[-6:]:
                    role = 'model' if hist['role'] == 'assistant' else 'user'
                    gemini_history.append({"role": role, "parts": [hist['content']]})
                
                chat = model.start_chat(history=gemini_history)
                response = chat.send_message(user_text)
                ai_text = response.text.strip()
                
                # Check for booking actions from the text response
                action = "none"
                if "success" in ai_text.lower() or "confirm" in ai_text.lower() or "book" in ai_text.lower():
                    if "appointment" in user_text.lower() or "haircut" in user_text.lower() or "booking" in user_text.lower():
                        action = "book_appointment"
                return ai_text, action
            except Exception as e:
                print(f"Gemini Call Failed, falling back to rule-based agent: {e}")

        # 5. Rule-Based Fallback Dialog Engine (Deterministic & offline-capable)
        text_lower = user_text.lower()
        
        # Check timings inquiry
        if any(w in text_lower for w in ["timing", "open", "close", "time", "khulta", "band"]):
            if detected_lang == "Telugu":
                return f"మా వ్యాపార వేళలు ప్రతిరోజూ ఉదయం {self.timings.split(' to ')[0]} నుండి రాత్రి {self.timings.split(' to ')[1]} వరకు ఉంటాయి.", "none"
            return f"Hamari timings subah {self.timings.split(' to ')[0]} se raat {self.timings.split(' to ')[1]} tak hain.", "none"

        # Check pricing/service enquiry
        if any(w in text_lower for w in ["service", "price", "rate", "haircut", "beard", "spa", "facial"]):
            if self.business and self.business.type == "Salon":
                if detected_lang == "Telugu":
                    return "మేము హెయిర్ కట్ (₹250), గడ్డం స్టైలింగ్ (₹150) మరియు ఫేషియల్ (₹500) సర్వీసులు అందిస్తాము.", "none"
                return "Hum Haircut (₹250), Beard Styling (₹150), and Facial (₹500) services provide karte hain.", "none"
            else:
                if detected_lang == "Telugu":
                    return "మా దగ్గర తాజా కూరగాయలు మరియు కిరాణా సరుకులు లభిస్తాయి.", "none"
                return "Hamare paas fresh grocery items and daily essentials available hain.", "none"

        # Check booking slot triggers
        if any(w in text_lower for w in ["book", "appointment", "appointment book", "booking", "milga", "slot"]):
            if detected_lang == "Telugu":
                return "తప్పకుండా. దయచేసి మీరు ఏ తేదీ మరియు సమయానికి అపాయింట్‌మెంట్ బుక్ చేయాలనుకుంటున్నారో చెప్పగలరా?", "book_appointment"
            return "Zaroor. Aap kis date aur time ke liye appointment lena chahenge?", "book_appointment"

        # Check active promotional offers
        if any(w in text_lower for w in ["offer", "discount", "cuhut", "chal raha"]):
            offers = self.db.query(Offer).filter(Offer.business_id == self.business_id, Offer.is_active == True).all()
            if offers:
                offer_titles = [f"{o.title} ({int(o.discount_percentage)}% off)" for o in offers]
                if detected_lang == "Telugu":
                    return f"అవును, ప్రస్తుతం మా వద్ద ఆఫర్ నడుస్తోంది: {', '.join(offer_titles)}.", "none"
                return f"Ji haan, is hafte special offer hai: {', '.join(offer_titles)}.", "none"
            else:
                if detected_lang == "Telugu":
                    return "ప్రస్తుతం ఎలాంటి ప్రత్యేక డిస్కౌంట్‌లు లేవు.", "none"
                return "Filhaal koi active offer nahi chal raha hai. Aap normal bookings kar sakte hain.", "none"

        # General acknowledgment greeting fallback
        if detected_lang == "Telugu":
            return "నేను మీకు ఏ విధంగా సహాయం చేయగలను? అపాయింట్‌మెంట్స్ లేదా సర్వీస్ వివరాలు అడగవచ్చు.", "none"
        return "Main aapki appointment book karne ya timing aur service details dene mein madad kar sakta hoon. Aap kya karna chahenge?", "none"
