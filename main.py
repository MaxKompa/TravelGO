from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import engine, get_db
from api_service import fetch_places_from_api

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TravelGo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

@app.post("/api/plan-trip", response_model=List[schemas.PlaceResponse])
def plan_trip(request: schemas.TripRequest, db: Session = Depends(get_db)):

    req_start_time = request.start_datetime.time()
    req_end_time = request.end_datetime.time()

    all_places_in_db = db.query(models.PlaceDB).filter(
        models.PlaceDB.city == request.city,
        models.PlaceDB.theme == request.theme
    ).all()

    if not all_places_in_db:
        print("No data in the database. Сheck the API...")
        api_data = fetch_places_from_api(request.country, request.city, request.theme)

        for item in api_data:
            new_place = models.PlaceDB(
                country=request.country,
                city=request.city,
                theme=request.theme,
                name=item["name"],
                photo_url=item["photo_url"],
                open_time=item["open_time"],
                close_time=item["close_time"],
                rating=item["rating"],
                short_description=item["short_description"]
            )
            db.add(new_place)
        db.commit()

        all_places_in_db = db.query(models.PlaceDB).filter(
            models.PlaceDB.city == request.city,
            models.PlaceDB.theme == request.theme
        ).all()
    else:
        print("Filtering by time....")

    # Filtration
    available_places = []
    for place in all_places_in_db:
        if place.open_time <= req_start_time and place.close_time >= req_end_time:
            available_places.append(place)


    return available_places