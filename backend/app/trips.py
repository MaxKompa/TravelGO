from pydantic import BaseModel
from sqlalchemy import text

from .database import SessionLocal


class TripCreate(BaseModel):
    name: str


class TripUpdate(BaseModel):
    name: str


class PlaceCreate(BaseModel):
    place_id: str
    name: str
    address: str | None = None
    latitude: float
    longitude: float


class RouteCreate(BaseModel):
    origin: str
    destination: str
    travel_mode: str = "WALK"
    distance_km: float
    duration_minutes: int
    polyline: str


def create_trip(data: TripCreate):

    db = SessionLocal()

    try:
        result = db.execute(
            text("""
                INSERT INTO trips (name)
                VALUES (:name)
            """),
            {"name": data.name}
        )

        db.commit()

        trip_id = result.lastrowid

        return {
            "id": trip_id,
            "name": data.name,
            "places": [],
            "routes": []
        }

    finally:
        db.close()


def get_trips():

    db = SessionLocal()

    try:
        result = db.execute(
            text("""
                SELECT id, name
                FROM trips
            """)
        )

        trips = []

        for row in result:
            trips.append({
                "id": row.id,
                "name": row.name,
                "places": [],
                "routes": []
            })

        return trips

    finally:
        db.close()


def get_trip(trip_id: int):

    db = SessionLocal()

    try:
        # Получаем trip
        result = db.execute(
            text("""
                SELECT id, name
                FROM trips
                WHERE id = :trip_id
            """),
            {"trip_id": trip_id}
        )

        row = result.fetchone()

        if not row:
            return {
                "error": "Trip not found"
            }

        # Получаем места этой поездки
        places_result = db.execute(
            text("""
                SELECT
                    p.id,
                    p.country,
                    p.city,
                    p.theme,
                    p.name,
                    p.photo_url,
                    p.open_time,
                    p.close_time,
                    p.rating,
                    p.short_description,
                    tl.visit_order,
                    tl.visited_at
                FROM trips_locations tl
                JOIN places p ON p.id = tl.location_id
                WHERE tl.trip_id = :trip_id
                ORDER BY tl.visit_order
            """),
            {"trip_id": trip_id}
        )

        places = []

        for place in places_result:
            places.append({
                "id": place.id,
                "country": place.country,
                "city": place.city,
                "theme": place.theme,
                "name": place.name,
                "photo_url": place.photo_url,
                "open_time": str(place.open_time) if place.open_time else None,
                "close_time": str(place.close_time) if place.close_time else None,
                "rating": place.rating,
                "short_description": place.short_description,
                "visit_order": place.visit_order,
                "visited_at": place.visited_at
            })

        return {
            "id": row.id,
            "name": row.name,
            "places": places,
            "routes": []
        }

    finally:
        db.close()


def update_trip(trip_id: int, data: TripUpdate):

    db = SessionLocal()

    try:
        result = db.execute(
            text("""
                UPDATE trips
                SET name = :name
                WHERE id = :trip_id
            """),
            {
                "name": data.name,
                "trip_id": trip_id
            }
        )

        db.commit()

        if result.rowcount == 0:
            return {
                "error": "Trip not found"
            }

        return get_trip(trip_id)

    finally:
        db.close()


def add_place_to_trip(trip_id: int, place: PlaceCreate):

    db = SessionLocal()

    try:
        # Проверяем trip
        trip = db.execute(
            text("""
                SELECT id
                FROM trips
                WHERE id = :trip_id
            """),
            {"trip_id": trip_id}
        ).fetchone()

        if not trip:
            return {
                "error": "Trip not found"
            }

        # Проверяем place
        existing_place = db.execute(
            text("""
                SELECT id
                FROM places
                WHERE id = :place_id
            """),
            {"place_id": int(place.place_id)}
        ).fetchone()

        if not existing_place:
            return {
                "error": "Place not found"
            }

        # Проверяем, не добавлено ли место уже
        already_added = db.execute(
            text("""
                SELECT trip_id
                FROM trips_locations
                WHERE trip_id = :trip_id
                AND location_id = :location_id
            """),
            {
                "trip_id": trip_id,
                "location_id": int(place.place_id)
            }
        ).fetchone()

        if already_added:
            return {
                "error": "Place already added to trip"
            }

        # Определяем следующий visit_order
        order_result = db.execute(
            text("""
                SELECT COALESCE(MAX(visit_order), 0) + 1
                FROM trips_locations
                WHERE trip_id = :trip_id
            """),
            {"trip_id": trip_id}
        )

        visit_order = order_result.scalar()

        # Добавляем связь
        db.execute(
            text("""
                INSERT INTO trips_locations
                (
                    trip_id,
                    location_id,
                    visit_order
                )
                VALUES
                (
                    :trip_id,
                    :location_id,
                    :visit_order
                )
            """),
            {
                "trip_id": trip_id,
                "location_id": int(place.place_id),
                "visit_order": visit_order
            }
        )

        db.commit()

        return get_trip(trip_id)

    finally:
        db.close()


def delete_place_from_trip(trip_id: int, place_id: str):

    db = SessionLocal()

    try:
        result = db.execute(
            text("""
                DELETE FROM trips_locations
                WHERE trip_id = :trip_id
                AND location_id = :location_id
            """),
            {
                "trip_id": trip_id,
                "location_id": int(place_id)
            }
        )

        db.commit()

        if result.rowcount == 0:
            return {
                "error": "Place not found"
            }

        return get_trip(trip_id)

    finally:
        db.close()


def add_route_to_trip(trip_id: int, route: RouteCreate):

    return {
        "message": "Route functionality will be connected to database next"
    }


def delete_route_from_trip(trip_id: int, route_index: int):

    return {
        "message": "Route functionality will be connected to database next"
    }