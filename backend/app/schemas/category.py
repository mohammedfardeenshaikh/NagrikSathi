from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class SubCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class SubCategoryCreate(SubCategoryBase):
    category_id: int

class SubCategoryResponse(SubCategoryBase):
    id: int
    category_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    subcategories: List[SubCategoryResponse] = []

    class Config:
        from_attributes = True
