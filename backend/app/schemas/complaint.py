from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class ComplaintBase(BaseModel):
    title: str
    description: str
    category_id: int
    subcategory_id: Optional[int] = None

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
