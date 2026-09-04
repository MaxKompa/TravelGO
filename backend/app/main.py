from fastapi import FastAPI

from .models import TranslationRequest, BudgetRequest, RouteRequest
from .translator import translate, get_languages
from .budget import calculate_budget
from .maps import get_route
from .places import search_places, get_place_details

from .trips import (
    TripCreate,
    TripUpdate,
    PlaceCreate,
    RouteCreate,
    create_trip,
    get_trips,
    get_trip,
    add_place_to_trip,
    add_route_to_trip,
    delete_place_from_trip,
    delete_route_from_trip,
    update_trip
)
app = FastAPI(
    title="TravelGO Backend",
    description="Backend aplikacji mobilnej TravelGO do planowania podróży.",
    version="1.0.0"
)


@app.get(
    "/",
    summary="Informacje o aplikacji",
    description="Zwraca podstawowe informacje o backendzie."
)
def home():
    return {
        "application": "TravelGO Backend",
        "version": "1.0.0",
        "status": "Online"
    }


@app.get(
    "/health",
    summary="Sprawdzenie stanu aplikacji",
    description="Sprawdza, czy backend działa poprawnie."
)
def health():
    return {
        "status": "OK"
    }


@app.get(
    "/version",
    summary="Wersja aplikacji",
    description="Zwraca aktualną wersję backendu."
)
def version():
    return {
        "version": "1.0.0"
    }


@app.get(
    "/languages",
    summary="Lista obsługiwanych języków",
    description="Zwraca listę wszystkich języków obsługiwanych przez tłumacza."
)
def languages():
    return get_languages()


@app.post(
    "/translate",
    summary="Tłumaczenie tekstu",
    description="Tłumaczy tekst pomiędzy wybranymi językami."
)
def translate_text(request: TranslationRequest):
    return translate(
        request.text,
        request.source,
        request.target
    )


@app.post(
    "/budget",
    summary="Kalkulator budżetu podróży",
    description="Oblicza całkowity koszt podróży na podstawie danych użytkownika."
)
def budget(request: BudgetRequest):
    return calculate_budget(request)

@app.post(
    "/route",
    summary="Wyznaczanie trasy",
    description="Wyznacza trasę pomiędzy dwoma punktami."
)
def route(request: RouteRequest):
    return get_route(
        request.origin,
        request.destination,
        request.travel_mode
    )

@app.get(
    "/places/search",
    summary="Wyszukiwanie miejsc",
    description="Wyszukuje miejsca i atrakcje na podstawie zapytania użytkownika."
)
def places_search(
    query: str,
    location: str = None
):
    return search_places(query, location)


@app.get(
    "/places/{place_id}",
    summary="Szczegóły miejsca",
    description="Zwraca szczegółowe informacje o wybranym miejscu."
)
def place_details(place_id: str):
    return get_place_details(place_id)


@app.post(
    "/trips",
    summary="Utworzenie podróży",
    description="Tworzy nową podróż."
)
def create_new_trip(request: TripCreate):
    return create_trip(request)


@app.get(
    "/trips",
    summary="Lista podróży",
    description="Zwraca wszystkie zapisane podróże."
)
def trips_list():
    return get_trips()


@app.get(
    "/trips/{trip_id}",
    summary="Szczegóły podróży",
    description="Zwraca szczegóły wybranej podróży."
)
def trip_details(trip_id: int):
    return get_trip(trip_id)


@app.post(
    "/trips/{trip_id}/places",
    summary="Dodanie miejsca do podróży",
    description="Dodaje wybrane miejsce do podróży."
)
def add_trip_place(
    trip_id: int,
    place: PlaceCreate
):
    return add_place_to_trip(trip_id, place)

@app.post(
    "/trips/{trip_id}/routes",
    summary="Dodanie trasy do podróży",
    description="Dodaje trasę do podróży."
)
def add_trip_route(
    trip_id: int,
    route: RouteCreate
):
    return add_route_to_trip(trip_id, route)

@app.delete(
    "/trips/{trip_id}/places/{place_id}",
    summary="Usunięcie miejsca z podróży",
    description="Usuwa miejsce z wybranej podróży."
)
def delete_trip_place(
    trip_id: int,
    place_id: str
):
    return delete_place_from_trip(trip_id, place_id)
@app.delete(
    "/trips/{trip_id}/routes/{route_index}",
    summary="Usunięcie trasy z podróży",
    description="Usuwa trasę z wybranej podróży."
)
def delete_trip_route(
    trip_id: int,
    route_index: int
):
    return delete_route_from_trip(trip_id, route_index)

@app.put(
    "/trips/{trip_id}",
    summary="Edycja podróży",
    description="Zmienia nazwę podróży."
)
def update_trip_endpoint(
    trip_id: int,
    data: TripUpdate
):
    return update_trip(trip_id, data)