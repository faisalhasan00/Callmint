from celery import Celery
from app.core.config import settings

# Initialize Celery app
celery_app = Celery(
    "voiceai_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Auto-discover tasks from the tasks package
celery_app.autodiscover_tasks(["app.tasks"])
