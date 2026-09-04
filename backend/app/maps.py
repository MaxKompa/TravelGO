import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes"


def get_route(origin: str, destination: str, travel_mode: str = "WALK"):
    if not API_KEY:
        raise Exception("GOOGLE_MAPS_API_KEY is not configured")

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": (
            "routes.duration,"
            "routes.distanceMeters,"
            "routes.polyline.encodedPolyline"
        )
    }

    data = {
        "origin": {
            "address": origin
        },
        "destination": {
            "address": destination
        },
        "travelMode": travel_mode
    }

    response = requests.post(
        ROUTES_URL,
        headers=headers,
        json=data
    )

    if not response.ok:
        raise Exception(
            f"Google Routes API error {response.status_code}: {response.text}"
        )

    result = response.json()

    if "routes" not in result or not result["routes"]:
        raise Exception("Route not found")

    route = result["routes"][0]

    distance_meters = route.get("distanceMeters", 0)


    duration_seconds = int(
        route.get("duration", "0s").replace("s", "")
    )

    return {
        "distance_km": round(distance_meters / 1000, 2),
        "duration_minutes": round(duration_seconds / 60),
        "polyline": route["polyline"]["encodedPolyline"]
    }


