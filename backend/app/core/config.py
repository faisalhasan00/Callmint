import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Database and Redis settings
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/postgres"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Security (JWT authentication)
    JWT_SECRET: str = "supersecretkeychangeinproduction"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 11520  # 8 days
    
    # AI Providers
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    
    # Voice and Telephony (Exotel)
    EXOTEL_ACCOUNT_SID: str = ""
    EXOTEL_API_KEY: str = ""
    EXOTEL_API_TOKEN: str = ""
    EXOTEL_PHONE_NUMBER: str = ""
    
    DEEPGRAM_API_KEY: str = ""
    ELEVENLABS_API_KEY: str = ""
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    PUBLIC_URL: str = ""
    
    # Load settings from environment file
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# Trigger reload for .env

# Reloading again to ensure keys are loaded
