from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.api.auth import get_active_user
from app.models.models import User, Customer
from app.schemas.schemas import CustomerCreate, CustomerOut

router = APIRouter(prefix="/customers", tags=["CRM Customers"])

@router.get("/", response_model=List[CustomerOut])
def get_customers(
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    # Enforce multi-tenant scoping via active business_id
    customers = db.query(Customer).filter(Customer.business_id == current_user.business_id).all()
    return customers


@router.post("/", response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
def create_customer(
    customer_in: CustomerCreate, 
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    # Verify if customer with same phone exists for this business
    existing = db.query(Customer).filter(
        Customer.business_id == current_user.business_id,
        Customer.phone == customer_in.phone
    ).first()
    
    if existing:
        return existing
        
    db_customer = Customer(
        business_id=current_user.business_id,
        name=customer_in.name,
        phone=customer_in.phone,
        preferred_language=customer_in.preferred_language,
        subscription_end_date=customer_in.subscription_end_date
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer_by_id(
    customer_id: int, 
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id, 
        Customer.business_id == current_user.business_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found in your CRM."
        )
    return customer


@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: int, 
    customer_in: CustomerCreate, 
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id, 
        Customer.business_id == current_user.business_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found."
        )
        
    customer.name = customer_in.name
    customer.phone = customer_in.phone
    customer.preferred_language = customer_in.preferred_language
    
    if customer_in.subscription_end_date is not None:
        customer.subscription_end_date = customer_in.subscription_end_date
    
    db.commit()
    db.refresh(customer)
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: int, 
    current_user: User = Depends(get_active_user), 
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id, 
        Customer.business_id == current_user.business_id
    ).first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found."
        )
        
    db.delete(customer)
    db.commit()
    return
