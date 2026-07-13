from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.db import get_db
from backend.app.models.complaint import Complaint
from backend.app.models.category import Category
from backend.app.schemas.dashboard import DashboardStats

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_statistics(db: Session = Depends(get_db)):
    """
    Get aggregated complaint counts and breakdowns for dashboard analytics.
    """
    total = db.query(Complaint).count()
    pending = db.query(Complaint).filter(Complaint.status == "Pending").count()
    in_progress = db.query(Complaint).filter(Complaint.status == "In Progress").count()
    resolved = db.query(Complaint).filter(Complaint.status == "Resolved").count()
    
    # High priority includes both High and Critical
    high_priority = db.query(Complaint).filter(Complaint.priority.in_(["High", "Critical"])).count()
    
    # Category counts
    by_category = {}
    categories = db.query(Category).all()
    for cat in categories:
        by_category[cat.name] = db.query(Complaint).filter(Complaint.category_id == cat.id).count()
        
    # Priority counts
    by_priority = {
        "Critical": db.query(Complaint).filter(Complaint.priority == "Critical").count(),
        "High": db.query(Complaint).filter(Complaint.priority == "High").count(),
        "Medium": db.query(Complaint).filter(Complaint.priority == "Medium").count(),
        "Low": db.query(Complaint).filter(Complaint.priority == "Low").count()
    }
    
    # Status counts
    by_status = {
        "Pending": pending,
        "In Progress": in_progress,
        "Resolved": resolved
    }
    
    return DashboardStats(
        total=total,
        pending=pending,
        in_progress=in_progress,
        resolved=resolved,
        high_priority=high_priority,
        by_category=by_category,
        by_priority=by_priority,
        by_status=by_status
    )
