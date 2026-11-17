import os
import requests
import random
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
import re

# Загружаем переменные окружения
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")

FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&q=80",
    "https://images.unsplash.com/photo-1466978913421-bac2e2eca5ab?w=800&q=80"
]

PRICE_MAP = {
    "PRICE_LEVEL_FREE": 0.0,
    "PRICE_LEVEL_INEXPENSIVE": 15.0,
    "PRICE_LEVEL_MODERATE": 30.0,
    "PRICE_LEVEL_EXPENSIVE": 60.0,
    "PRICE_LEVEL_VERY_EXPENSIVE": 100.0
}

def get_google_search_query(city: str, country: str, theme: str) -> str:
    """Формируем умные запросы для Google в зависимости от темы"""
    theme = theme.lower().strip()
    if theme == "food":
        return f"best restaurants and cafes in {city}, {country}"
    elif theme == "history":
        return f"historical landmarks and museums in {city}, {country}"
    elif theme == "hiking":
        return f"hiking trails, nature reserves and parks in {city}, {country}"
    elif theme == "after dark":
        return f"bars, pubs and nightclubs in {city}, {country}"
    elif theme == "art":
        return f"art galleries and museums in {city}, {country}"
    return f"top tourist attractions in {city}, {country}"

def parse_new_google_hours(periods: list) -> list:
    """Парсер часов для нового формата Google Places API (New)"""
    day_map = {
        0: "Sunday", 1: "Monday", 2: "Tuesday",
        3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"
    }

    hours_list = []
    for period in periods:
        open_data = period.get("open")
        close_data = period.get("close")

        if not open_data:
            continue

        day_name = day_map.get(open_data.get("day", 0))
        open_time = f"{open_data.get('hour', 0):02d}:{open_data.get('minute', 0):02d}:00"
        close_time = f"{close_data.get('hour', 0):02d}:{close_data.get('minute', 0):02d}:00" if close_data else "23:59:59"

        hours_list.append({"day": day_name, "open_time": open_time, "close_time": close_time})

    return hours_list

def get_clean_image_url(photo_name: str) -> str | None:
    """Получение прямой ссылки на фото без sleep"""
    url = f"https://places.googleapis.com/v1/{photo_name}/media?maxHeightPx=800&skipHttpRedirect=true"
    headers = {"X-Goog-Api-Key": GOOGLE_API_KEY}
    try:
        resp = requests.get(url, headers=headers, timeout=5)
        if resp.status_code == 200:
            return resp.json().get("photoUri")
    except Exception:
        pass
    return None

def get_missing_photo_from_new_api(place_id: str) -> str | None:
    """Точечный запрос к Новому API: вытаскиваем фото, если поиск его не отдал"""
    url = f"https://places.googleapis.com/v1/places/{place_id}"
    headers = {
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "photos"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=5)
        if resp.status_code == 200:
            photos = resp.json().get("photos", [])
            if photos and photos[0].get("name"):
                return get_clean_image_url(photos[0]["name"])
    except Exception:
        pass
    return None

def process_single_place(place: dict, theme: str) -> dict:
    """Обработка одного места (запускается параллельно в потоках)"""
    name = place.get("displayName", {}).get("text", "Unknown Place")
    place_resource_name = place.get("name", "")
    place_id = place_resource_name.replace("places/", "") if place_resource_name else ""

    photos = place.get("photos", [])
    image_url = None

    # ШАГ 1: Фото из общего поиска
    if photos and photos[0].get("name"):
        image_url = get_clean_image_url(photos[0]["name"])

    # ШАГ 2: Точечный запрос, если фото нет
    if not image_url and place_id:
        image_url = get_missing_photo_from_new_api(place_id)

    # ШАГ 3: Заглушка
    if not image_url:
        image_url = random.choice(FALLBACK_IMAGES)

    description = place.get("primaryTypeDisplayName", {}).get("text", theme.capitalize())
    periods = place.get("regularOpeningHours", {}).get("periods", [])
    hours_list = parse_new_google_hours(periods) if periods else []

    if not hours_list:
        hours_list = [
            {"day": d, "open_time": "00:00:00", "close_time": "23:59:59"}
            for d in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        ]

    price_level_text = place.get("priceLevel", "PRICE_LEVEL_MODERATE")

    return {
        "name": name[:100],
        "image_url": image_url,
        "google_rating": float(place.get("rating", 0.0)),
        "description": description[:255],
        "price_avg": PRICE_MAP.get(price_level_text, 20.0),
        "latitude": float(place["location"]["latitude"]),
        "longitude": float(place["location"]["longitude"]),
        "hours": hours_list
    }

def fetch_places_from_api(country: str, city: str, theme: str) -> list:
    print(f"📥 Загрузка данных из Google Places API для: {city} ({theme})...")

    query = get_google_search_query(city, country, theme)
    search_url = "https://places.googleapis.com/v1/places:searchText"

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.name,places.displayName,places.rating,places.primaryTypeDisplayName,places.priceLevel,places.location,places.photos,places.regularOpeningHours,nextPageToken"
    }

    all_places = []
    page_token = ""

    for page_num in range(3):
        body = {"textQuery": query, "languageCode": "en", "maxResultCount": 20}
        if page_token:
            body["pageToken"] = page_token

        try:
            response = requests.post(search_url, json=body, headers=headers, timeout=15)
            if response.status_code != 200:
                print(f"⚠️ Ошибка Google API (страница {page_num + 1}): {response.status_code}")
                break

            data = response.json()
            all_places.extend(data.get("places", []))

            page_token = data.get("nextPageToken")
            if not page_token:
                break
        except Exception:
            break

    # Параллельно распаковываем картинки и собираем объекты (15 потоков одновременно)
    with ThreadPoolExecutor(max_workers=15) as executor:
        places_data = list(executor.map(lambda p: process_single_place(p, theme), all_places))

    print(f"✅ Успешно обработано мест за пару секунд: {len(places_data)}")
    return places_data

def fetch_events_from_api(city: str, start_date: str | None = None, end_date: str | None = None) -> list:
    """Быстрый поиск событий, фестивалей и культурных площадок через Google Places API"""
    search_url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.id,places.name,places.displayName,places.primaryTypeDisplayName,places.location,places.photos,places.regularOpeningHours,places.rating"
    }

    queries = [
        f"festivals, concerts and live music in {city}",
        f"theaters, exhibitions and cultural events in {city}"
    ]

    def search_query(q: str) -> list:
        try:
            resp = requests.post(
                search_url,
                json={"textQuery": q, "languageCode": "en", "maxResultCount": 8},
                headers=headers,
                timeout=8
            )
            return resp.json().get("places", []) if resp.status_code == 200 else []
        except Exception:
            return []

    # Запускаем оба поисковых запроса параллельно
    with ThreadPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(search_query, queries))

    # Объединяем и убираем дубликаты по id
    raw_places = []
    seen_ids = set()
    for group in results:
        for p in group:
            pid = p.get("id")
            if pid and pid not in seen_ids:
                seen_ids.add(pid)
                raw_places.append(p)

    def build_event_card(place: dict, idx: int) -> dict:
        name = place.get("displayName", {}).get("text", "Event Venue")
        photos = place.get("photos", [])
        image_url = None
        if photos and photos[0].get("name"):
            image_url = get_clean_image_url(photos[0]["name"])
        if not image_url:
            image_url = random.choice(FALLBACK_IMAGES)

        # Часы работы площадки
        periods = place.get("regularOpeningHours", {}).get("periods", [])
        venue_time = "18:00 - 23:00"
        if periods and periods[0].get("open"):
            o = periods[0]["open"]
            c = periods[0].get("close")
            open_str = f"{o.get('hour', 10):02d}:{o.get('minute', 0):02d}"
            close_str = f"{c.get('hour', 22):02d}:{c.get('minute', 0):02d}" if c else "23:00"
            venue_time = f"{open_str} - {close_str}"

        return {
            "id": f"ev_{idx}_{place.get('id', '')[:8]}",
            "name": name[:100],
            "category": place.get("primaryTypeDisplayName", {}).get("text", "Event & Festival"),
            "date": start_date or "Актуально в эти даты",
            "time": venue_time,
            "venue": name,
            "image_url": image_url,
            "price_min": 0.0,
            "ticket_url": f"https://www.google.com/search?q={name.replace(' ', '+')}+{city}+tickets+events",
            "latitude": float(place["location"]["latitude"]),
            "longitude": float(place["location"]["longitude"])
        }

    # Параллельно распаковываем картинки в 12 потоков
    with ThreadPoolExecutor(max_workers=12) as executor:
        return list(executor.map(lambda item: build_event_card(item[1], item[0]), enumerate(raw_places[:12])))