from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from backend.app.core.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    complaints = relationship("Complaint", back_populates="user", cascade="all, delete-orphan")
