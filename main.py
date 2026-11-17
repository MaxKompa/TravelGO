from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text  # Добавили для безопасной очистки связей в БД
from typing import Optional, List
from zoneinfo import ZoneInfo

import models
import schemas
import auth
from database import get_db
from api_service import fetch_places_from_api, fetch_events_from_api
import api_service

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

@app.post("/api/events", response_model=list[schemas.EventResponse])
def get_city_events(req: schemas.EventRequest):
    return api_service.fetch_events_from_api(
        city=req.city,
        start_date=req.start_date,
        end_date=req.end_date
    )

@app.get("/api/debug/clear")
def clear_db_for_debug(db: Session = Depends(get_db)):
    """Секретный эндпоинт для очистки базы при тестировании API Гугла"""
    # 1. Сначала удаляем связи локаций с поездками (чтобы база не ругалась)
    db.execute(text("DELETE FROM trips_locations"))

    # 2. Удаляем часы работы
    db.query(models.OpenHours).delete()

    # 3. Теперь безопасно удаляем сами локации
    db.query(models.Location).delete()

    db.commit()
    return {"message": "✅ База локаций и часов очищена! Следующий запрос пойдет в Google API."}


@app.post("/api/plan-trip", response_model=List[schemas.PlaceResponse])
def plan_trip(request: schemas.TripRequest, db: Session = Depends(get_db)):

    # 1. Берем часовой пояс прямо от фронтенда! (например, "Europe/Warsaw")
    tz_string = request.user_location if request.user_location else "UTC"

    # Пытаемся применить пояс. Если фронт пришлет какую-то ерунду, ставим UTC
    try:
        local_tz = ZoneInfo(tz_string)
    except Exception:
        local_tz = ZoneInfo("UTC")

    # 2. Переводим пришедшее время в локальное время нужного города
    start_local = request.start_datetime.astimezone(local_tz)
    end_local = request.end_datetime.astimezone(local_tz)

    # 3. Безопасно извлекаем время и день недели уже с учетом нужной страны
    req_start_time = start_local.time()
    req_end_time = end_local.time()
    req_day = start_local.strftime("%A")

    # Переводим время в строки для удобного сравнения
    req_start_str = str(req_start_time)
    req_end_str = str(req_end_time)

    # 4. Защита от "бага полуночи"
    if req_end_str.startswith("00:00"):
        req_end_str = "23:59:59"

    # 5. Понимаем, просит ли юзер полные сутки
    is_full_day = (req_start_str.startswith("00:00") and req_end_str.startswith("23:59"))

    # =========================================================
    # РАБОТА С БАЗОЙ ДАННЫХ
    # =========================================================

    # Szukamy lub tworzymy KRAJ
    country_db = db.query(models.Country).filter(models.Country.name == request.country).first()
    if not country_db:
        country_db = models.Country(name=request.country, regions=False)
        db.add(country_db)
        db.commit()
        db.refresh(country_db)

    # Szukamy lub tworzymy MIASTO
    city_db = db.query(models.City).filter(
        models.City.name == request.city,
        models.City.country_id == country_db.id
    ).first()
    if not city_db:
        city_db = models.City(name=request.city, country_id=country_db.id)
        db.add(city_db)
        db.commit()
        db.refresh(city_db)

    # Szukamy lub tworzymy TEMAT
    theme_db = db.query(models.Theme).filter(models.Theme.name == request.theme).first()
    if not theme_db:
        theme_db = models.Theme(name=request.theme)
        db.add(theme_db)
        db.commit()
        db.refresh(theme_db)

    # Szukamy LOKACJI w bazie danych
    locations_in_db = db.query(models.Location).filter(
        models.Location.city_id == city_db.id,
        models.Location.theme_id == theme_db.id
    ).all()

    # Jeśli nie ma lokalizacji, przechodzimy do API
    if not locations_in_db:
        print("В БД нет локаций. Идем в API...")
        api_data = fetch_places_from_api(request.country, request.city, request.theme)

        for item in api_data:
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

            for h in item["hours"]:
                new_hour = models.OpenHours(
                    day=h["day"],
                    open_time=h["open_time"],
                    close_time=h["close_time"]
                )
                new_location.hours.append(new_hour)

            db.add(new_location)

        db.commit()

        locations_in_db = db.query(models.Location).filter(
            models.Location.city_id == city_db.id,
            models.Location.theme_id == theme_db.id
        ).all()
    else:
        print("Данные взяты из базы.")

    # =========================================================
    # ФИЛЬТРАЦИЯ
    # =========================================================

    available_places = []
    for loc in locations_in_db:

        if not loc.hours:
            available_places.append(loc)
            continue

        day_schedule = next((h for h in loc.hours if h.day == req_day), None)

        if day_schedule:
            if is_full_day:
                available_places.append(loc)
            else:
                day_open = str(day_schedule.open_time)
                day_close = str(day_schedule.close_time)
                # Мягкое пересечение времени
                if day_open < req_end_str and day_close > req_start_str:
                    available_places.append(loc)

    # УМНАЯ ДОБИВКА: Если открытых мест меньше 20
    if len(available_places) < 20:
        closed_locations = [loc for loc in locations_in_db if loc not in available_places]
        closed_locations.sort(key=lambda x: x.google_rating if x.google_rating else 0.0, reverse=True)
        needed = 20 - len(available_places)
        available_places.extend(closed_locations[:needed])

    print("-" * 40)
    print(f"📥 Всего было в базе: {len(locations_in_db)} мест.")
    print(f"✅ Итоговый список на фронт: {len(available_places)} мест.")
    print("-" * 40)

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

    # Печатаем, что именно пришло с фронта
    print(f"Пытаемся залогинить: email='{user.email}', password='{user.password}'")

    db_user = db.query(models.UserLocal).filter(models.UserLocal.email == user.email).first()

    if not db_user:
        print("❌ ОШИБКА: Пользователь с таким email вообще не найден в БД!")
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    if not db_user.password:
        print("❌ ОШИБКА: У пользователя в БД пустой пароль!")
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    # Печатаем хеш из базы
    print(f"Хеш в БД: {db_user.password}")
    print(f"Длина хеша в БД: {len(db_user.password)} символов (если меньше 60 - это баг БД!)")

    is_password_correct = auth.verify_password(user.password, db_user.password)
    print(f"Пароль совпал?: {is_password_correct}")

    if not is_password_correct:
        print("❌ ОШИБКА: Функция verify_password вернула False!")
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    print("✅ ЛОГИН УСПЕШЕН!")
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

    google_user = db.query(models.UserGoogle).filter(models.UserGoogle.provider_id == google_id).first()

    if google_user:
        user_local = db.query(models.UserLocal).filter(models.UserLocal.id == google_user.user_id).first()
    else:
        user_local = db.query(models.UserLocal).filter(models.UserLocal.email == email).first()

        if not user_local:
            user_local = models.UserLocal(username=name, email=email, avatar_url=avatar)
            db.add(user_local)
            db.flush()

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


@app.get("/api/laws/{country_name}", response_model=List[schemas.LawResponse])
def get_local_laws(
        country_name: str,
        region_name: Optional[str] = Query(None, description="Название региона, если есть"),
        db: Session = Depends(get_db)
):
    country = db.query(models.Country).filter(models.Country.name == country_name).first()
    if not country:
        raise HTTPException(status_code=404, detail="Страна не найдена в базе")

    query = db.query(models.Law).filter(models.Law.country_id == country.id)

    if region_name:
        region = db.query(models.Region).filter(
            models.Region.name == region_name,
            models.Region.country_id == country.id
        ).first()

        if region:
            query = query.filter((models.Law.region_id == region.id) | (models.Law.region_id == None))
        else:
            query = query.filter(models.Law.region_id == None)
    else:
        query = query.filter(models.Law.region_id == None)

    return query.all()

