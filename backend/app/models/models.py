from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.db import Base

class Business(Base):
    __tablename__ = "businesses"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # e.g., "Salon" or "SuperMart"
    timings_open = Column(String, default="09:00")
    timings_close = Column(String, default="20:00")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="business", cascade="all, delete-orphan")
    customers = relationship("Customer", back_populates="business", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="business", cascade="all, delete-orphan")
    offers = relationship("Offer", back_populates="business", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="business", cascade="all, delete-orphan")
    call_logs = relationship("CallLog", back_populates="business", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="business", uselist=False, cascade="all, delete-orphan")
    ai_config = relationship("AIConfig", back_populates="business", uselist=False, cascade="all, delete-orphan")
    templates = relationship("ConversationTemplate", back_populates="business", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Owner")  # "Owner" or "Staff" or "SuperAdmin"
    is_active = Column(Boolean, default=False)  # Becomes active when a subscription plan is subscribed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    business = relationship("Business", back_populates="users")


class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), unique=True, nullable=False)
    plan = Column(String, nullable=False)  # "Starter" (₹999) or "Growth" (₹1,999)
    status = Column(String, default="Pending")  # "Pending", "Active", "Cancelled"
    monthly_minutes_limit = Column(Integer, default=200)  # 200 for Starter, 500 for Growth
    minutes_used = Column(Float, default=0.0)
    billing_cycle_start = Column(DateTime, default=datetime.utcnow)
    billing_cycle_end = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    business = relationship("Business", back_populates="subscription")


class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    preferred_language = Column(String, default="Hinglish")  # "Hindi", "Telugu", "Hinglish"
    subscription_end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    business = relationship("Business", back_populates="customers")
    appointments = relationship("Appointment", back_populates="customer", cascade="all, delete-orphan")
    call_logs = relationship("CallLog", back_populates="customer")


class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    date_time = Column(DateTime, nullable=False)
    service = Column(String, nullable=False)  # e.g. "Haircut", "Beard Styling"
    status = Column(String, default="Scheduled")  # "Scheduled", "Rescheduled", "Cancelled"
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    business = relationship("Business", back_populates="appointments")
    customer = relationship("Customer", back_populates="appointments")


class Offer(Base):
    __tablename__ = "offers"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    discount_percentage = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    business = relationship("Business", back_populates="offers")
    campaigns = relationship("Campaign", back_populates="offer")


class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "Follow-up", "Promotional", "Festival", "Subscription Renewal", "Custom Goal"
    custom_prompt = Column(Text, nullable=True)  # User's custom instruction to the AI for this campaign
    target_date_start = Column(DateTime, nullable=True) # Audience targeting start date
    target_date_end = Column(DateTime, nullable=True)   # Audience targeting end date
    offer_id = Column(Integer, ForeignKey("offers.id", ondelete="SET NULL"), nullable=True)
    scheduled_at = Column(DateTime, nullable=False)
    status = Column(String, default="Draft")  # "Draft", "Scheduled", "Running", "Completed"
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    business = relationship("Business", back_populates="campaigns")
    offer = relationship("Offer", back_populates="campaigns")


class CallLog(Base):
    __tablename__ = "call_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)
    direction = Column(String, nullable=False)  # "inbound" or "outbound"
    status = Column(String, nullable=False)  # "completed", "failed", "no-answer", "ringing"
    recording_url = Column(String, nullable=True)
    transcript = Column(Text, nullable=True)
    duration_seconds = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    business = relationship("Business", back_populates="call_logs")
    customer = relationship("Customer", back_populates="call_logs")
    usage_logs = relationship("UsageLog", back_populates="call_log", cascade="all, delete-orphan")


class UsageLog(Base):
    __tablename__ = "usage_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    call_log_id = Column(Integer, ForeignKey("call_logs.id", ondelete="CASCADE"), nullable=False)
    minutes_charged = Column(Float, nullable=False)
    cost = Column(Float, default=0.0)  # Calculated for minutes exceeding limits (overage)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    call_log = relationship("CallLog", back_populates="usage_logs")


class AIConfig(Base):
    __tablename__ = "ai_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), unique=True, nullable=False)
    voice_style = Column(String, default="Professional Female")  # "Friendly Male", "Telugu Female", etc.
    language = Column(String, default="Hinglish")  # Fallback default language
    custom_system_prompt = Column(Text, nullable=True)
    custom_greeting = Column(Text, nullable=True)  # Greeting text override
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    business = relationship("Business", back_populates="ai_config")


class ConversationTemplate(Base):
    __tablename__ = "conversation_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=True)  # Null implies system-level default
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "inbound" or "outbound"
    template_json = Column(JSON, nullable=False)  # Conversation rules, intents, keywords
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    business = relationship("Business", back_populates="templates")
