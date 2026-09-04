import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

PLACES_URL = "https://places.googleapis.com/v1/places:searchText"


def search_places(query: str, location: str = None):

    if not API_KEY:
        raise Exception("GOOGLE_MAPS_API_KEY is not configured")

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": (
            "places.id,"
            "places.displayName,"
            "places.formattedAddress,"
            "places.location,"
            "places.rating,"
            "places.priceLevel"
        )
    }

    text_query = query

    if location:
        text_query = f"{query}, {location}"

    data = {
        "textQuery": text_query
    }

    print(f"PLACES REQUEST: {text_query}")

    response = requests.post(
        PLACES_URL,
        headers=headers,
        json=data
    )

    print(f"GOOGLE STATUS: {response.status_code}")
    print(f"GOOGLE RESPONSE: {response.text}")

    if response.status_code != 200:
        raise Exception(
            f"Google Places API error: "
            f"HTTP {response.status_code} - {response.text}"
        )

    result = response.json()

    places = []

    for place in result.get("places", []):
        places.append({
            "id": place.get("id"),
            "name": place.get("displayName", {}).get("text"),
            "address": place.get("formattedAddress"),
            "latitude": place.get("location", {}).get("latitude"),
            "longitude": place.get("location", {}).get("longitude"),
            "rating": place.get("rating"),
            "price_level": place.get("priceLevel")
        })

    print(f"FOUND PLACES: {len(places)}")

    return places

def get_place_details(place_id: str):
    if not API_KEY:
        raise Exception("GOOGLE_MAPS_API_KEY is not configured")

    url = f"https://places.googleapis.com/v1/places/{place_id}"

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": (
            "id,"
            "displayName,"
            "formattedAddress,"
            "location,"
            "rating,"
            "priceLevel,"
            "nationalPhoneNumber,"
            "websiteUri,"
            "regularOpeningHours,"
            "types"
        )
    }

    response = requests.get(
        url,
        headers=headers
    )

    print(f"PLACE DETAILS STATUS: {response.status_code}")
    print(f"PLACE DETAILS RESPONSE: {response.text}")

    if response.status_code != 200:
        raise Exception(
            f"Google Places API error: "
            f"HTTP {response.status_code} - {response.text}"
        )

    place = response.json()

    return {
        "id": place.get("id"),
        "name": place.get("displayName", {}).get("text"),
        "address": place.get("formattedAddress"),
        "latitude": place.get("location", {}).get("latitude"),
        "longitude": place.get("location", {}).get("longitude"),
        "rating": place.get("rating"),
        "price_level": place.get("priceLevel"),
        "phone": place.get("nationalPhoneNumber"),
        "website": place.get("websiteUri"),
        "opening_hours": place.get("regularOpeningHours"),
        "types": place.get("types", [])
    }