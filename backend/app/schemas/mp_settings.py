from pydantic import BaseModel


class MPSettingsResponse(BaseModel):
    mp_name: str
    constituency: str
    email: str
    notify_high_priority: bool = True
    notify_unresolved: bool = True
    notify_weekly: bool = False

    class Config:
        from_attributes = True


class MPSettingsUpdate(BaseModel):
    mp_name: str
    constituency: str
    email: str
    notify_high_priority: bool = True
    notify_unresolved: bool = True
    notify_weekly: bool = False
