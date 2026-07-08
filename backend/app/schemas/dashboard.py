from pydantic import BaseModel

class DashboardStats(BaseModel):
    total: int
    pending: int
    in_progress: int
    resolved: int
    high_priority: int
