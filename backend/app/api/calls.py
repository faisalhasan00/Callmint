from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, date

from app.core.db import get_db
from app.api.auth import get_active_user
from app.models.models import User, CallLog, Customer, Appointment, Offer, Subscription
from app.schemas.schemas import CallLogOut, DashboardStats

router = APIRouter(prefix="/calls", tags=["Call Logs & Analytics"])

@router.get("/", response_model=List[CallLogOut])
def get_call_logs(
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    logs = db.query(CallLog).filter(
        CallLog.business_id == current_user.business_id
    ).order_by(CallLog.created_at.desc()).all()
    return logs


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    business_id = current_user.business_id
    
    # 1. Total Calls
    total_calls = db.query(func.count(CallLog.id)).filter(CallLog.business_id == business_id).scalar() or 0
    
    # 2. Total CRM Customers
    total_customers = db.query(func.count(Customer.id)).filter(Customer.business_id == business_id).scalar() or 0
    
    # 3. Appointments Today
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())
    appointments_today = db.query(func.count(Appointment.id)).filter(
        Appointment.business_id == business_id,
        Appointment.date_time >= today_start,
        Appointment.date_time <= today_end,
        Appointment.status != "Cancelled"
    ).scalar() or 0
    
    # 4. Active Offers
    active_offers = db.query(func.count(Offer.id)).filter(
        Offer.business_id == business_id,
        Offer.is_active == True
    ).scalar() or 0
    
    # 5. Subscription minute trackers
    sub = db.query(Subscription).filter(Subscription.business_id == business_id).first()
    
    minutes_used = 0.0
    minutes_limit = 0
    plan_name = "None"
    sub_status = "Pending"
    
    if sub:
        minutes_used = sub.minutes_used
        minutes_limit = sub.monthly_minutes_limit
        plan_name = sub.plan
        sub_status = sub.status
        
    return DashboardStats(
        total_calls=total_calls,
        total_customers=total_customers,
        appointments_today=appointments_today,
        active_offers=active_offers,
        minutes_used=minutes_used,
        minutes_limit=minutes_limit,
        plan_name=plan_name,
        subscription_status=sub_status
    )
