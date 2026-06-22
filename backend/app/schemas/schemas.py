from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    business_id: Optional[int] = None
    role: Optional[str] = None


# Business/Tenant Schemas
class BusinessBase(BaseModel):
    name: str
    type: str  # "Salon" or "SuperMart"
    timings_open: Optional[str] = "09:00"
    timings_close: Optional[str] = "20:00"

class BusinessCreate(BusinessBase):
    pass

class BusinessOut(BusinessBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# User Schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    business_name: str
    business_type: str  # "Salon" or "SuperMart"

class UserLogin(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    business_id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Subscription & Billing Schemas
class SubscriptionSubscribe(BaseModel):
    plan: str  # "Starter" or "Growth"

class SubscriptionOut(BaseModel):
    id: int
    business_id: int
    plan: str
    status: str
    monthly_minutes_limit: int
    minutes_used: float
    billing_cycle_start: datetime
    billing_cycle_end: datetime

    class Config:
        from_attributes = True


# Customer/CRM Schemas
class CustomerBase(BaseModel):
    name: str
    phone: str
    preferred_language: Optional[str] = "Hinglish"
    subscription_end_date: Optional[datetime] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerOut(CustomerBase):
    id: int
    business_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Appointment Schemas
class AppointmentBase(BaseModel):
    customer_id: int
    date_time: datetime
    service: str

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentOut(AppointmentBase):
    id: int
    business_id: int
    status: str
    created_at: datetime
    customer: Optional[CustomerOut] = None

    class Config:
        from_attributes = True


# Offer Schemas
class OfferBase(BaseModel):
    title: str
    description: Optional[str] = None
    discount_percentage: float
    is_active: Optional[bool] = True

class OfferCreate(OfferBase):
    pass

class OfferOut(OfferBase):
    id: int
    business_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Campaign Schemas
class CampaignBase(BaseModel):
    name: str
    type: str  # "Follow-up", "Promotional", "Festival", "Subscription Renewal", "Custom Goal"
    custom_prompt: Optional[str] = None
    target_date_start: Optional[datetime] = None
    target_date_end: Optional[datetime] = None
    offer_id: Optional[int] = None
    scheduled_at: datetime

class CampaignCreate(CampaignBase):
    pass

class CampaignOut(CampaignBase):
    id: int
    business_id: int
    status: str
    created_at: datetime
    offer: Optional[OfferOut] = None

    class Config:
        from_attributes = True


# CallLog & UsageLog Schemas
class CallLogOut(BaseModel):
    id: int
    business_id: int
    customer_id: Optional[int] = None
    direction: str
    status: str
    recording_url: Optional[str] = None
    transcript: Optional[str] = None
    duration_seconds: int
    created_at: datetime

    class Config:
        from_attributes = True


# AIConfig Schemas
class AIConfigBase(BaseModel):
    voice_style: Optional[str] = "Professional Female"
    language: Optional[str] = "Hinglish"
    custom_system_prompt: Optional[str] = None
    custom_greeting: Optional[str] = None

class AIConfigCreate(AIConfigBase):
    pass

class AIConfigOut(AIConfigBase):
    id: int
    business_id: int

    class Config:
        from_attributes = True


# Dashboard Statistics Schema
class DashboardStats(BaseModel):
    total_calls: int
    total_customers: int
    appointments_today: int
    active_offers: int
    minutes_used: float
    minutes_limit: int
    plan_name: str
    subscription_status: str
