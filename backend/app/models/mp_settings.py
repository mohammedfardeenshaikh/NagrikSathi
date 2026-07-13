from sqlalchemy import Column, Integer, String, Boolean
from backend.app.core.db import Base


class MPSettings(Base):
    __tablename__ = "mp_settings"

    id = Column(Integer, primary_key=True, index=True, default=1)
    mp_name = Column(String(150), nullable=False, default="Dr. Ramesh Kumar")
    constituency = Column(String(150), nullable=False, default="Rampur Constituency")
    email = Column(String(150), nullable=False, default="mp@nagriksathi.in")
    notify_high_priority = Column(Boolean, nullable=False, default=True)
    notify_unresolved = Column(Boolean, nullable=False, default=True)
    notify_weekly = Column(Boolean, nullable=False, default=False)
