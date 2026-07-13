from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.db import get_db
from backend.app.models.mp_settings import MPSettings
from backend.app.schemas.mp_settings import MPSettingsResponse, MPSettingsUpdate

router = APIRouter()


def get_or_create_settings(db: Session) -> MPSettings:
    """Always returns the single settings row (ID=1), creating it if needed."""
    settings = db.query(MPSettings).filter(MPSettings.id == 1).first()
    if not settings:
        settings = MPSettings(
            id=1,
            mp_name="Dr. Ramesh Kumar",
            constituency="Rampur Constituency",
            email="mp@nagriksathi.in",
            notify_high_priority=True,
            notify_unresolved=True,
            notify_weekly=False,
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("/", response_model=MPSettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    """Retrieve the MP portal settings."""
    return get_or_create_settings(db)


@router.put("/", response_model=MPSettingsResponse)
def update_settings(payload: MPSettingsUpdate, db: Session = Depends(get_db)):
    """Update and persist MP portal settings."""
    settings = get_or_create_settings(db)
    settings.mp_name = payload.mp_name
    settings.constituency = payload.constituency
    settings.email = payload.email
    settings.notify_high_priority = payload.notify_high_priority
    settings.notify_unresolved = payload.notify_unresolved
    settings.notify_weekly = payload.notify_weekly
    db.commit()
    db.refresh(settings)
    return settings
