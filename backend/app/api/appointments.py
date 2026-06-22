from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.core.db import get_db
from app.api.auth import get_active_user
from app.models.models import User, Appointment, Customer
from app.schemas.schemas import AppointmentCreate, AppointmentOut

router = APIRouter(prefix="/appointments", tags=["Appointments Scheduler"])

@router.get("/", response_model=List[AppointmentOut])
def get_appointments(
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    # Retrieve all appointments, joining customer details
    appointments = db.query(Appointment).options(
        joinedload(Appointment.customer)
    ).filter(
        Appointment.business_id == current_user.business_id
    ).order_by(Appointment.date_time.asc()).all()
    
    return appointments


@router.post("/", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment_in: AppointmentCreate, 
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    # Validate customer belongs to this business
    customer = db.query(Customer).filter(
        Customer.id == appointment_in.customer_id,
        Customer.business_id == current_user.business_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specified customer does not exist in your CRM."
        )
        
    db_appointment = Appointment(
        business_id=current_user.business_id,
        customer_id=appointment_in.customer_id,
        date_time=appointment_in.date_time,
        service=appointment_in.service,
        status="Scheduled"
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    
    # Reload with customer relation loaded
    db_appointment = db.query(Appointment).options(
        joinedload(Appointment.customer)
    ).filter(
        Appointment.id == db_appointment.id
    ).first()
    
    return db_appointment


@router.put("/{appointment_id}", response_model=AppointmentOut)
def update_appointment(
    appointment_id: int,
    appointment_in: AppointmentCreate,
    status_override: Optional[str] = None,
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.business_id == current_user.business_id
    ).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found."
        )
        
    appointment.date_time = appointment_in.date_time
    appointment.service = appointment_in.service
    
    if status_override:
        if status_override not in ["Scheduled", "Rescheduled", "Cancelled"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status name. Choose 'Scheduled', 'Rescheduled', or 'Cancelled'."
            )
        appointment.status = status_override
        
    db.commit()
    db.refresh(appointment)
    
    # Reload with customer relation loaded
    appointment = db.query(Appointment).options(
        joinedload(Appointment.customer)
    ).filter(
        Appointment.id == appointment.id
    ).first()
    
    return appointment


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_appointment(
    appointment_id: int, 
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.business_id == current_user.business_id
    ).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found."
        )
        
    # Mark as Cancelled or delete
    appointment.status = "Cancelled"
    db.commit()
    return
