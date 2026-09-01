from sqlalchemy import Column, Integer, String, Float, Time, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from database import Base


class Country(Base):
    __tablename__ = "country"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(45), unique=True, index=True)
    regions = Column(Boolean, default=False)

class Region(Base):
    __tablename__ = "regions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))
    country_id = Column(Integer, ForeignKey("country.id"))

class City(Base):
    __tablename__ = "city"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True)
    country_id = Column(Integer, ForeignKey("country.id"))

class Theme(Base):
    __tablename__ = "themes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(20), unique=True, index=True)

class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    google_rating = Column(Float)
    theme_id = Column(Integer, ForeignKey("themes.id"))
    description = Column(String(255))
    city_id = Column(Integer, ForeignKey("city.id"))
    image_url = Column(String(255))
    price_avg = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)

    # позволяет обращаться location.hours
    hours = relationship("OpenHours", back_populates="location")

class OpenHours(Base):
    __tablename__ = "open_hours"
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    day = Column(String(20)) # "Monday", "Tuesday", и т.д.
    open_time = Column(Time)
    close_time = Column(Time)

    location = relationship("Location", back_populates="hours")

class UserLocal(Base):
    __tablename__ = "user_local"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50))
    password = Column(String(255), nullable=True) # Может быть пустым при входе через Google
    avatar_url = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True)

class UserGoogle(Base):
    __tablename__ = "user_google"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_local.id"))
    provider = Column(String(20), default="google")
    provider_id = Column(String(255), unique=True)
    email = Column(String(255))
    avatar_url = Column(String(255), nullable=True)