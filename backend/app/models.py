from pydantic import BaseModel, Field
from typing import List


class TranslationRequest(BaseModel):
    text: str = Field(
        ...,
        description="Tekst do przetłumaczenia",
        examples=["Hello"]
    )

    source: str = Field(
        default="auto",
        description="Język źródłowy"
    )

    target: str = Field(
        ...,
        description="Język docelowy",
        examples=["pl"]
    )


class Activity(BaseModel):

    name: str = Field(
        ...,
        description="Nazwa atrakcji",
        examples=["Cinema"]
    )

    category: str = Field(
        ...,
        description="Kategoria atrakcji",
        examples=["Entertainment"]
    )

    price: float = Field(
        ...,
        gt=0,
        description="Cena atrakcji w PLN"
    )


class BudgetRequest(BaseModel):

    days: int = Field(
        ...,
        gt=0,
        description="Liczba dni podróży"
    )

    people: int = Field(
        ...,
        gt=0,
        description="Liczba uczestników podróży"
    )

    hotel_per_day: float = Field(
        ...,
        ge=0,
        description="Koszt hotelu za jedną dobę"
    )

    food_per_day: float = Field(
        ...,
        ge=0,
        description="Koszt wyżywienia na osobę za dzień"
    )

    transport: float = Field(
        ...,
        ge=0,
        description="Łączny koszt transportu"
    )

    currency: str = Field(
        default="PLN",
        description="Waluta obliczeń"
    )

    reserve_percent: float = Field(
        default=10,
        ge=0,
        le=100,
        description="Procent rezerwy na nieprzewidziane wydatki"
    )

    activities: List[Activity] = Field(
        default_factory=list,
        description="Lista wybranych atrakcji"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "days": 7,
                "people": 2,
                "hotel_per_day": 250,
                "food_per_day": 120,
                "transport": 500,
                "currency": "PLN",
                "reserve_percent": 10,
                "activities": [
                    {
                        "name": "Cinema",
                        "category": "Entertainment",
                        "price": 80
                    },
                    {
                        "name": "Museum",
                        "category": "Culture",
                        "price": 50
                    }
                ]
            }
        }
    }



class RouteCreate(BaseModel):
    origin: str
    destination: str
    travel_mode: str = "WALK"
    distance_km: float
    duration_minutes: int
    polyline: str


class RouteRequest(BaseModel):
    origin: str = Field(
        ...,
        description="Punkt początkowy trasy",
        examples=["Poznań Główny"]
    )

    destination: str = Field(
        ...,
        description="Punkt docelowy trasy",
        examples=["Stary Rynek, Poznań"]
    )

    travel_mode: str = Field(
        default="WALK",
        description="Sposób podróży: WALK, DRIVE, BICYCLE lub TRANSIT"
    )

    