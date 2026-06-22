from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List

from app.core.db import get_db
from app.api.auth import get_active_user
from app.models.models import User, AIConfig, ConversationTemplate
from app.schemas.schemas import AIConfigCreate, AIConfigOut

router = APIRouter(prefix="/configs", tags=["AI Configuration & Templates"])

@router.get("/ai", response_model=AIConfigOut)
def get_ai_config(current_user: User = Depends(get_active_user), db: Session = Depends(get_db)):
    config = db.query(AIConfig).filter(AIConfig.business_id == current_user.business_id).first()
    if not config:
        # Auto-create if it doesn't exist for some reason
        config = AIConfig(
            business_id=current_user.business_id,
            voice_style="Professional Female",
            language="Hinglish",
            custom_greeting=f"Namaste, welcome to our business. How can I assist you today?"
        )
        db.add(config)
        db.commit()
        db.refresh(config)
    return config


@router.put("/ai", response_model=AIConfigOut)
def update_ai_config(
    config_in: AIConfigCreate, 
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    config = db.query(AIConfig).filter(AIConfig.business_id == current_user.business_id).first()
    if not config:
        config = AIConfig(business_id=current_user.business_id)
        db.add(config)
        
    config.voice_style = config_in.voice_style
    config.language = config_in.language
    config.custom_system_prompt = config_in.custom_system_prompt
    config.custom_greeting = config_in.custom_greeting
    
    db.commit()
    db.refresh(config)
    return config


@router.get("/templates")
def get_conversation_templates(
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    # Fetch system defaults (business_id is Null) or custom templates for this business
    templates = db.query(ConversationTemplate).filter(
        or_(
            ConversationTemplate.business_id.is_(None),
            ConversationTemplate.business_id == current_user.business_id
        )
    ).all()
    
    # If no templates exist in database, return standard hardcoded defaults
    if not templates:
        return [
            {
                "id": 0,
                "name": "Default Salon Template",
                "type": "inbound",
                "template_json": {
                    "greeting": "Namaste, XYZ Salon mein aapka swagat hai. Main aapki kis tarah madad kar sakta hoon?",
                    "services": ["Haircut", "Beard Styling", "Hair Spa", "Facial"],
                    "pricing": {"Haircut": 250, "Beard Styling": 150, "Hair Spa": 600, "Facial": 500},
                    "timings": "9:00 AM to 8:00 PM"
                }
            },
            {
                "id": 0,
                "name": "Default SuperMart Template",
                "type": "inbound",
                "template_json": {
                    "greeting": "Namaste, XYZ SuperMart mein aapka swagat hai. Main aapki kis tarah madad kar sakta hoon?",
                    "timings": "8:00 AM to 10:00 PM",
                    "promotions": "Weekend discount offers: 15% off selected grocery items."
                }
            }
        ]
        
    return templates
