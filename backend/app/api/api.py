from fastapi import APIRouter
from backend.app.api.endpoints import complaints, dashboard, auth, categories

api_router = APIRouter()

api_router.include_router(auth.router, tags=["Authentication"])
api_router.include_router(categories.router, tags=["Categories & Subcategories"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["Complaints"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
