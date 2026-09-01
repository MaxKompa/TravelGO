from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, time

class TripRequest(BaseModel):
    country: str
    city: str
    start_datetime: datetime
    end_datetime: datetime
    theme: str

class OpenHourSchema(BaseModel):
    day: str
    open_time: time
    close_time: time

    class Config:
        from_attributes = True

class PlaceResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    google_rating: Optional[float] = None
    price_avg: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    hours: List[OpenHourSchema] = []

    class Config:
        from_attributes = True

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str