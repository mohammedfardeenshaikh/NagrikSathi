from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, func
from sqlalchemy.orm import relationship
from backend.app.core.db import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    subcategory_id = Column(Integer, ForeignKey("sub_categories.id", ondelete="SET NULL"), nullable=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    ai_summary = Column(Text, nullable=True)
    priority = Column(String(50), nullable=False, default="Low")
    priority_reason = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)
    status = Column(String(50), nullable=False, default="Pending")
    
    # New tracking fields
    ward = Column(String(100), nullable=True, default="Ward 4")
    district = Column(String(100), nullable=True, default="Rampur")
    assigned_officer = Column(String(100), nullable=True)
    internal_notes = Column(Text, nullable=True)
    escalated = Column(Integer, nullable=False, default=0) # 0 = No, 1 = Yes
    
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="complaints")
    category = relationship("Category", back_populates="complaints")
    subcategory = relationship("SubCategory", back_populates="complaints")
