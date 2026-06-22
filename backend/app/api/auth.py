from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta

from app.core.db import get_db
from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.models import User, Business, Subscription, AIConfig
from app.schemas.schemas import UserCreate, Token, UserOut, UserLogin, BusinessOut, BusinessBase

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Note: In Next.js, the token will be fetched from headers as Bearer token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def get_active_user(current_user: User = Depends(get_current_user)) -> User:
    # Check if the user's business subscription is active.
    # Users register publicly but cannot use the core features without a subscription.
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Subscription required. Please select a plan to activate your account."
        )
    return current_user


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    # 1. Initialize Business (Tenant)
    db_business = Business(
        name=user_in.business_name,
        type=user_in.business_type
    )
    db.add(db_business)
    db.commit()
    db.refresh(db_business)
    
    # 2. Create Default AI Settings for the business
    db_ai_config = AIConfig(
        business_id=db_business.id,
        voice_style="Professional Female",
        language="Hinglish",
        custom_greeting=f"Namaste, welcome to {db_business.name}. How can I help you today?"
    )
    db.add(db_ai_config)
    
    # 3. Create Pending Subscription for the business
    db_sub = Subscription(
        business_id=db_business.id,
        plan="None",
        status="Pending",
        monthly_minutes_limit=0,
        minutes_used=0.0,
        billing_cycle_start=datetime.utcnow(),
        billing_cycle_end=datetime.utcnow() + timedelta(days=30)
    )
    db.add(db_sub)
    
    # 4. Create User
    db_user = User(
        business_id=db_business.id,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role="Owner",
        is_active=False  # Requires plan selection to activate
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.post("/login", response_model=Token)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    
    # Check subscription status and sync user.is_active flag
    sub = db.query(Subscription).filter(Subscription.business_id == user.business_id).first()
    if sub and sub.status == "Active" and not user.is_active:
        user.is_active = True
        db.commit()
        db.refresh(user)
    elif sub and sub.status != "Active" and user.is_active:
        user.is_active = False
        db.commit()
        db.refresh(user)
        
    access_token = create_access_token(
        data={"sub": user.email, "business_id": user.business_id, "role": user.role}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/business", response_model=BusinessOut)
def get_business(current_user: User = Depends(get_active_user), db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == current_user.business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


@router.put("/business", response_model=BusinessOut)
def update_business(
    business_in: BusinessBase,
    current_user: User = Depends(get_active_user),
    db: Session = Depends(get_db)
):
    business = db.query(Business).filter(Business.id == current_user.business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    business.name = business_in.name
    business.type = business_in.type
    business.timings_open = business_in.timings_open
    business.timings_close = business_in.timings_close
    
    db.commit()
    db.refresh(business)
    return business
