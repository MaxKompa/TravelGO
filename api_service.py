import time as py_time
from datetime import time

def fetch_places_from_api(country: str, city: str, theme: str) -> list:
    print(f"Calling API {city} ({theme})...")
    py_time.sleep(1)

    return [
        {
            "name": f"The Great {theme.capitalize()} Spot",
            "photo_url": "https://example.com/photo1.jpg",
            "open_time": time(9, 0),   # Open from 9:00 a.m.
            "close_time": time(19, 0), # Until 7:00 p.m.
            "rating": 4.8,
            "short_description": "Tourist Attraction"
        },
        {
            "name": f"{city} Night Club",
            "photo_url": "https://example.com/photo2.jpg",
            "open_time": time(20, 0),  # Open from 8:00 p.m.
            "close_time": time(23, 59), # To 00:00
            "rating": 4.5,
            "short_description": "Entertainment"
        }
    ]