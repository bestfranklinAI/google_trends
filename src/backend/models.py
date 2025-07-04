from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class TrendRequest(BaseModel):
    """Parameters accepted by the trends API."""

    # Location and language are required with defaults matching Google Trends UI
    geo: str = "HK"
    hl: str = "en"
    # Optional filters. None values will be omitted from the generated URL
    hours: Optional[int] = None
    category: Optional[str] = None
    sort: Optional[str] = None
    status: Optional[str] = None
    url: Optional[str] = None

class Trend(BaseModel):
    """Single trending topic."""

    title: str
    search_volume: Optional[str] = None
    ranking: Optional[int] = None
    change_percentage: Optional[str] = None
    related_queries: Optional[List[str]] = None
    url: Optional[str] = None
    
class TrendsResponse(BaseModel):
    """Response returned by the API."""

    topics: List[Trend]
    source_url: str
    timestamp: datetime
    total_trends: int
    location: str
    language: str
