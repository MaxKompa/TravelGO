from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import datetime

import models, schemas
from database import engine, get_db
from api_service import fetch_places_from_api

from fastapi import HTTPException, status
import auth

# Эту строчку мы отключаем, так как БД создает DBA
# models.Base.metadata.create_all(bind=engine)

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
    # Określamy dzień tygodnia (na przykład „Monday”) na podstawie daty zapytania
    req_day = request.start_datetime.strftime("%A")

    # 1. Szukamy lub tworzymy KRAJ
    country_db = db.query(models.Country).filter(models.Country.name == request.country).first()
    if not country_db:
        country_db = models.Country(name=request.country, regions=False)
        db.add(country_db)
        db.commit()
        db.refresh(country_db)

    # 2. Szukamy lub tworzymy MIASTO
    city_db = db.query(models.City).filter(
        models.City.name == request.city,
        models.City.country_id == country_db.id
    ).first()
    if not city_db:
        city_db = models.City(name=request.city, country_id=country_db.id)
        db.add(city_db)
        db.commit()
        db.refresh(city_db)

    # 3. Szukamy lub tworzymy TEMAT
    theme_db = db.query(models.Theme).filter(models.Theme.name == request.theme).first()
    if not theme_db:
        theme_db = models.Theme(name=request.theme)
        db.add(theme_db)
        db.commit()
        db.refresh(theme_db)

    # 4. Szukamy LOKACJI w bazie danych według miasta i tematu
    locations_in_db = db.query(models.Location).filter(
        models.Location.city_id == city_db.id,
        models.Location.theme_id == theme_db.id
    ).all()

    # 5. Jeśli nie ma lokalizacji, przechodzimy do API i rozdzielamy dane między tabele
    if not locations_in_db:
        print("В БД нет локаций. Идем в API...")
        api_data = fetch_places_from_api(request.country, request.city, request.theme)

        for item in api_data:
            # Zapisujemy samą lokalizację
            new_location = models.Location(
                name=item["name"],
                google_rating=item["google_rating"],
                theme_id=theme_db.id,
                description=item["description"],
                city_id=city_db.id,
                image_url=item["image_url"],
                price_avg=item["price_avg"],
                latitude=item["latitude"],
                longitude=item["longitude"]
            )
            db.add(new_location)
            db.flush() # Funkcja `flush` wysyła dane do bazy danych w celu uzyskania identyfikatora, ale nie kończy transakcji całkowicie

            # Zapisujemy godziny otwarcia dla tej lokalizacji
            for h in item["hours"]:
                new_hour = models.OpenHours(
                    location_id=new_location.id, # Wykorzystujemy aktualny identyfikator lokalizacji
                    day=h["day"],
                    open_time=h["open_time"],
                    close_time=h["close_time"]
                )
                db.add(new_hour)

        db.commit() # Zapisujemy wszystko razem (zarówno lokalizacje, jak i godziny)

        # Pobieramy zaktualizowane dane z bazy
        locations_in_db = db.query(models.Location).filter(
            models.Location.city_id == city_db.id,
            models.Location.theme_id == theme_db.id
        ).all()
    else:
        print("Данные взяты из базы.")

    # 6. FILTROWANIE WEDŁUG GODZINY I DNIA TYGODNIA
    available_places = []
    for loc in locations_in_db:
        # Szukamy rozkładu właśnie na ten dzień tygodnia, o który poprosił użytkownik
        day_schedule = next((h for h in loc.hours if h.day == req_day), None)

        if day_schedule:
            # Sprawdzamy, czy lokal jest otwarty w wybranym przedziale czasowym
            if day_schedule.open_time <= req_start_time and day_schedule.close_time >= req_end_time:
                available_places.append(loc)

    return available_places

@app.post("/api/auth/register", response_model=schemas.TokenResponse)
def register_user(user: schemas.UserRegister, db: Session = Depends(get_db)):
    if db.query(models.UserLocal).filter(models.UserLocal.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    new_user = models.UserLocal(
        username=user.username,
        email=user.email,
        password=auth.hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = auth.create_access_token(data={"sub": str(new_user.id)})
    return {"access_token": token, "username": new_user.username}


@app.post("/api/auth/login", response_model=schemas.TokenResponse)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.UserLocal).filter(models.UserLocal.email == user.email).first()

    if not db_user or not db_user.password or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    token = auth.create_access_token(data={"sub": str(db_user.id)})
    return {"access_token": token, "username": db_user.username}


@app.post("/api/auth/google", response_model=schemas.TokenResponse)
def google_auth(request: schemas.GoogleAuthRequest, db: Session = Depends(get_db)):
    google_data = auth.verify_google_token(request.token)
    if not google_data:
        raise HTTPException(status_code=401, detail="Недействительный Google токен")

    email = google_data.get("email")
    google_id = google_data.get("sub")
    name = google_data.get("name")
    avatar = google_data.get("picture")

    # Ищем, есть ли уже этот гугл-аккаунт в базе
    google_user = db.query(models.UserGoogle).filter(models.UserGoogle.provider_id == google_id).first()

    if google_user:
        # Юзер уже есть, берем его основной аккаунт
        user_local = db.query(models.UserLocal).filter(models.UserLocal.id == google_user.user_id).first()
    else:
        # Это новый юзер! Проверяем, есть ли такой email в обычной регистрации
        user_local = db.query(models.UserLocal).filter(models.UserLocal.email == email).first()

        if not user_local:
            # Создаем полностью нового юзера
            user_local = models.UserLocal(username=name, email=email, avatar_url=avatar)
            db.add(user_local)
            db.flush() # Получаем ID для связи

        # Привязываем Google-аккаунт к user_local
        new_google_link = models.UserGoogle(
            user_id=user_local.id,
            provider_id=google_id,
            email=email,
            avatar_url=avatar
        )
        db.add(new_google_link)
        db.commit()

    token = auth.create_access_token(data={"sub": str(user_local.id)})
    return {"access_token": token, "username": user_local.username}