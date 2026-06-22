from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.core.config import settings
from app.core.db import engine, Base

# Import models to ensure they are registered with Base metadata
from app.models import models

# Import API routers
from app.api import auth, billing, customers, appointments, campaigns, configs, calls, exotel

# Proactively create tables on startup if they don't exist
# This allows instant zero-migration setup on Supabase
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables synchronized successfully.")
except Exception as e:
    print(f"Error synchronizing database: {e}")

app = FastAPI(
    title="AI Voice Employee API",
    description="Multi-tenant backend API for booking appointments, running calling campaigns, and voice configuration.",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adapt to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach API sub-routers
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"[{request.method}] {request.url.path}")
    response = await call_next(request)
    return response

app.include_router(auth.router, prefix="/api/v1")
app.include_router(billing.router, prefix="/api/v1")
app.include_router(customers.router, prefix="/api/v1")
app.include_router(appointments.router, prefix="/api/v1")
app.include_router(campaigns.router, prefix="/api/v1")
app.include_router(configs.router, prefix="/api/v1")
app.include_router(calls.router, prefix="/api/v1")
app.include_router(exotel.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "product": "AI Voice Employee MVP",
        "supported_languages": ["Telugu", "Hindi", "Hinglish"],
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
