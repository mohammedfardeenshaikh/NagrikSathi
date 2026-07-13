from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class ComplaintBase(BaseModel):
    title: str
    description: str
    category_id: int
    subcategory_id: Optional[int] = None
    ward: Optional[str] = "Ward 4"
    district: Optional[str] = "Rampur"

class ComplaintCreate(ComplaintBase):
    user_id: int

class ComplaintResponse(ComplaintBase):
    id: int
    user_id: int
    status: str
    priority: str
    ai_summary: Optional[str] = None
    priority_reason: Optional[str] = None
    tags: Optional[List[str]] = []
    
    # New tracking fields
    assigned_officer: Optional[str] = None
    internal_notes: Optional[str] = None
    escalated: int = 0
    
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintPatch(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    ward: Optional[str] = None
    district: Optional[str] = None
    assigned_officer: Optional[str] = None
    internal_notes: Optional[str] = None
    escalated: Optional[int] = None
