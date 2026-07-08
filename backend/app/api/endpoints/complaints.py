from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.db import get_db
from backend.app.models.complaint import Complaint
from backend.app.models.user import User
from backend.app.models.category import Category, SubCategory
from backend.app.schemas.complaint import ComplaintCreate, ComplaintResponse, ComplaintPatch
from backend.app.services.ai import ai_service

router = APIRouter()

@router.post("/", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create_complaint(complaint_in: ComplaintCreate, db: Session = Depends(get_db)):
    """
    Submit a citizen complaint. Validates that the reporter user_id and category_id exist,
    triggers AI classification metrics, and persists the record.
    """
    # 1. Validate User exists
    user = db.query(User).filter(User.id == complaint_in.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {complaint_in.user_id} not found."
        )

    # 2. Validate Category exists
    category = db.query(Category).filter(Category.id == complaint_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {complaint_in.category_id} not found."
        )

    # 3. Validate SubCategory if provided
    if complaint_in.subcategory_id is not None:
        subcategory = db.query(SubCategory).filter(
            SubCategory.id == complaint_in.subcategory_id,
            SubCategory.category_id == complaint_in.category_id
        ).first()
        if not subcategory:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"SubCategory with ID {complaint_in.subcategory_id} does not exist or does not belong to Category {complaint_in.category_id}."
            )

    # 4. Trigger AI analysis pipeline
    ai_analysis = ai_service.analyze_complaint(
        title=complaint_in.title,
        description=complaint_in.description, 
        category=category.name
    )

    # 5. Insert Complaint
    db_complaint = Complaint(
        user_id=complaint_in.user_id,
        category_id=complaint_in.category_id,
        subcategory_id=complaint_in.subcategory_id,
        title=complaint_in.title,
        description=complaint_in.description,
        ai_summary=ai_analysis["summary"],
        priority=ai_analysis["priority"],
        priority_reason=ai_analysis["priority_reason"],
        tags=ai_analysis["tags"],
        status="Pending"
    )

    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.get("/", response_model=List[ComplaintResponse])
def read_complaints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    List all submitted complaints.
    """
    return db.query(Complaint).offset(skip).limit(limit).all()

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def read_complaint_by_id(complaint_id: int, db: Session = Depends(get_db)):
    """
    Get details of a specific complaint by ID.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Complaint with ID {complaint_id} not found."
        )
    return complaint

@router.patch("/{complaint_id}", response_model=ComplaintResponse)
def patch_complaint(complaint_id: int, complaint_patch: ComplaintPatch, db: Session = Depends(get_db)):
    """
    Partially update a complaint's parameters (e.g. status, priority, category).
    Validates related keys if modified.
    """
    db_complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID {complaint_id} not found."
        )
        
    update_data = complaint_patch.model_dump(exclude_unset=True)
    
    # 1. Validate Category if modified
    if "category_id" in update_data:
        cat = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not cat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category with ID {update_data['category_id']} not found."
            )
            
    # 2. Validate SubCategory if modified
    if "subcategory_id" in update_data:
        sub_id = update_data["subcategory_id"]
        cat_id = update_data.get("category_id", db_complaint.category_id)
        if sub_id is not None:
            sub = db.query(SubCategory).filter(SubCategory.id == sub_id, SubCategory.category_id == cat_id).first()
            if not sub:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"SubCategory with ID {sub_id} is invalid or does not belong to Category {cat_id}."
                )

    # 3. Apply updates
    for key, value in update_data.items():
        setattr(db_complaint, key, value)
        
    db.commit()
    db.refresh(db_complaint)
    return db_complaint
