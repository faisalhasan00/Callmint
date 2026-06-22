from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.core.db import get_db
from app.api.auth import get_current_user
from app.models.models import User, Subscription, Business
from app.schemas.schemas import SubscriptionOut, SubscriptionSubscribe

router = APIRouter(prefix="/billing", tags=["Billing & Subscriptions"])

@router.get("/status", response_model=SubscriptionOut)
def get_billing_status(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(Subscription.business_id == current_user.business_id).first()
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription data not found for this account."
        )
    return sub


@router.post("/subscribe", response_model=SubscriptionOut)
def subscribe_to_plan(
    plan_in: SubscriptionSubscribe, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if plan_in.plan not in ["Starter", "Growth"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan name. Choose 'Starter' or 'Growth'."
        )
        
    sub = db.query(Subscription).filter(Subscription.business_id == current_user.business_id).first()
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription account context missing."
        )
        
    # Set plan allocations
    limit_minutes = 200 if plan_in.plan == "Starter" else 500
    
    sub.plan = plan_in.plan
    sub.status = "Active"
    sub.monthly_minutes_limit = limit_minutes
    sub.billing_cycle_start = datetime.utcnow()
    sub.billing_cycle_end = datetime.utcnow() + timedelta(days=30)
    
    # Activate user account for dashboard features
    current_user.is_active = True
    
    db.commit()
    db.refresh(sub)
    db.refresh(current_user)
    
    return sub
