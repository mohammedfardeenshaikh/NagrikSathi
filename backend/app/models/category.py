from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint, func
from sqlalchemy.orm import relationship
from backend.app.core.db import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    subcategories = relationship("SubCategory", back_populates="category", cascade="all, delete-orphan")
    complaints = relationship("Complaint", back_populates="category")

class SubCategory(Base):
    __tablename__ = "sub_categories"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    category = relationship("Category", back_populates="subcategories")
    complaints = relationship("Complaint", back_populates="subcategory")

    __table_args__ = (UniqueConstraint("category_id", "name", name="uq_category_subcategory"),)
