from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.core.db import get_db
from backend.app.models.category import Category, SubCategory
from backend.app.schemas.category import CategoryResponse, SubCategoryResponse

router = APIRouter()

@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """
    Retrieve all seeded categories and their subcategories.
    """
    return db.query(Category).all()

@router.get("/subcategories", response_model=List[SubCategoryResponse])
def get_subcategories(
    category_id: Optional[int] = Query(None, description="Filter by category ID"), 
    db: Session = Depends(get_db)
):
    """
    Retrieve all subcategories, with optional category filtering.
    """
    query = db.query(SubCategory)
    if category_id is not None:
        query = query.filter(SubCategory.category_id == category_id)
    return query.all()
