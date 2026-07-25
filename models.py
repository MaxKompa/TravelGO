from sqlalchemy import Column, Integer, String, Float, Time
from database import Base

class PlaceDB(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String(50), index=True)
    city = Column(String(50), index=True)
    theme = Column(String(50), index=True)

    # For the frontend
    name = Column(String(100))
    photo_url = Column(String(255))
    
    open_time = Column(Time)
    close_time = Column(Time)
    
    rating = Column(Float)
    short_description = Column(String(100)) # For example: "Italian pizza", "Museum"