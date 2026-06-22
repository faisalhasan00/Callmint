from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime

from app.core.db import get_db
from app.api.auth import get_active_user
from app.models.models import User, Offer, Campaign
from app.schemas.schemas import OfferCreate, OfferOut, CampaignCreate, CampaignOut, CustomerOut
from app.tasks.tasks import launch_campaign_task

router = APIRouter(tags=["Offers & Marketing Campaigns"])

# --- OFFERS ENDPOINTS ---
@router.get("/offers", response_model=List[OfferOut])
def get_offers(
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    offers = db.query(Offer).filter(Offer.business_id == current_user.business_id).all()
    return offers


@router.post("/offers", response_model=OfferOut, status_code=status.HTTP_201_CREATED)
def create_offer(
    offer_in: OfferCreate, 
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    db_offer = Offer(
        business_id=current_user.business_id,
        title=offer_in.title,
        description=offer_in.description,
        discount_percentage=offer_in.discount_percentage,
        is_active=offer_in.is_active
    )
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return db_offer


@router.put("/offers/{offer_id}", response_model=OfferOut)
def update_offer(
    offer_id: int,
    offer_in: OfferCreate,
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    offer = db.query(Offer).filter(
        Offer.id == offer_id,
        Offer.business_id == current_user.business_id
    ).first()
    
    if not offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offer not found."
        )
        
    offer.title = offer_in.title
    offer.description = offer_in.description
    offer.discount_percentage = offer_in.discount_percentage
    offer.is_active = offer_in.is_active
    
    db.commit()
    db.refresh(offer)
    return offer


# --- CAMPAIGNS ENDPOINTS ---
@router.get("/campaigns", response_model=List[CampaignOut])
def get_campaigns(
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    campaigns = db.query(Campaign).options(
        joinedload(Campaign.offer)
    ).filter(
        Campaign.business_id == current_user.business_id
    ).order_by(Campaign.scheduled_at.desc()).all()
    
    return campaigns


@router.post("/campaigns", response_model=CampaignOut, status_code=status.HTTP_201_CREATED)
def create_campaign(
    campaign_in: CampaignCreate, 
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    # Validate offer if specified
    if campaign_in.offer_id:
        offer = db.query(Offer).filter(
            Offer.id == campaign_in.offer_id,
            Offer.business_id == current_user.business_id
        ).first()
        if not offer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Specified promotional offer does not exist or belong to your tenant."
            )
            
    db_campaign = Campaign(
        business_id=current_user.business_id,
        name=campaign_in.name,
        type=campaign_in.type,
        custom_prompt=campaign_in.custom_prompt,
        target_date_start=campaign_in.target_date_start,
        target_date_end=campaign_in.target_date_end,
        offer_id=campaign_in.offer_id,
        scheduled_at=campaign_in.scheduled_at,
        status="Draft"
    )
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    
    # Reload with offer details
    db_campaign = db.query(Campaign).options(
        joinedload(Campaign.offer)
    ).filter(
        Campaign.id == db_campaign.id
    ).first()
    
    return db_campaign


@router.get("/campaigns/{campaign_id}/preview_targets", response_model=List[CustomerOut])
def preview_campaign_targets(
    campaign_id: int, 
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    from app.models.models import Customer
    
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.business_id == current_user.business_id
    ).first()
    
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found."
        )
        
    query = db.query(Customer).filter(Customer.business_id == campaign.business_id)
    
    if campaign.target_date_start:
        query = query.filter(Customer.created_at >= campaign.target_date_start)
    if campaign.target_date_end:
        query = query.filter(Customer.created_at <= campaign.target_date_end)
        
    if campaign.type == "Subscription Renewal":
        from datetime import datetime
        query = query.filter((Customer.subscription_end_date == None) | (Customer.subscription_end_date < datetime.utcnow()))
        
    customers = query.all()
    return customers


@router.post("/campaigns/{campaign_id}/launch", response_model=CampaignOut)
def launch_campaign(
    campaign_id: int, 
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.business_id == current_user.business_id
    ).first()
    
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found."
        )
        
    if campaign.status in ["Running", "Completed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Campaign has already been launched or completed."
        )
        
    campaign.status = "Running"
    db.commit()
    db.refresh(campaign)
    
    # Trigger calling all contacts mapped to this campaign in the background
    background_tasks.add_task(launch_campaign_task, campaign.id)
    
    return campaign


@router.put("/campaigns/{campaign_id}", response_model=CampaignOut)
def update_campaign(
    campaign_id: int,
    campaign_in: CampaignCreate,
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.business_id == current_user.business_id
    ).first()

    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found."
        )

    if campaign.status in ["Running", "Completed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot edit a campaign that has already launched or completed."
        )

    # Validate offer if specified
    if campaign_in.offer_id:
        offer = db.query(Offer).filter(
            Offer.id == campaign_in.offer_id,
            Offer.business_id == current_user.business_id
        ).first()
        if not offer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Specified promotional offer does not exist."
            )

    campaign.name = campaign_in.name
    campaign.type = campaign_in.type
    campaign.custom_prompt = campaign_in.custom_prompt
    campaign.target_date_start = campaign_in.target_date_start
    campaign.target_date_end = campaign_in.target_date_end
    campaign.offer_id = campaign_in.offer_id
    campaign.scheduled_at = campaign_in.scheduled_at

    db.commit()
    db.refresh(campaign)

    # Reload with offer details
    campaign = db.query(Campaign).options(
        joinedload(Campaign.offer)
    ).filter(
        Campaign.id == campaign.id
    ).first()

    return campaign


@router.delete("/campaigns/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campaign(
    campaign_id: int,
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.business_id == current_user.business_id
    ).first()

    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found."
        )

    if campaign.status in ["Running"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a campaign that is currently running."
        )

    db.delete(campaign)
    db.commit()
    return None
