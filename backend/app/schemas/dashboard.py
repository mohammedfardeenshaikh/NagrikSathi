from pydantic import BaseModel
from typing import Dict

class DashboardStats(BaseModel):
    total: int
    pending: int
    in_progress: int
    resolved: int
    high_priority: int
    by_category: Dict[str, int]
    by_priority: Dict[str, int]
    by_status: Dict[str, int]
