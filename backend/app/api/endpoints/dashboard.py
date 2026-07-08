from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.db import get_db
from backend.app.models.complaint import Complaint
from backend.app.schemas.dashboard import DashboardStats

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_statistics(db: Session = Depends(get_db)):
    """
    Get aggregated complaint counts for dashboard analytics.
    """
    total = db.query(Complaint).count()
    pending = db.query(Complaint).filter(Complaint.status == "Pending").count()
    in_progress = db.query(Complaint).filter(Complaint.status == "In Progress").count()
    resolved = db.query(Complaint).filter(Complaint.status == "Resolved").count()
    high_priority = db.query(Complaint).filter(Complaint.priority == "High").count()
    
    return DashboardStats(
        total=total,
        pending=pending,
        in_progress=in_progress,
        resolved=resolved,
        high_priority=high_priority
    )
