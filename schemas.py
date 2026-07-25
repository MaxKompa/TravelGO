from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, time

# Accept data
class TripRequest(BaseModel):
    country: str
    city: str
    start_datetime: datetime
    end_datetime: datetime
    theme: str

# Sending data
class PlaceResponse(BaseModel):
    name: str
    photo_url: Optional[str] = None
    open_time: Optional[time] = None
    close_time: Optional[time] = None
    rating: Optional[float] = None
    short_description: Optional[str] = None

    class Config:
        orm_mode = True  