import time as py_time
from datetime import time

def fetch_places_from_api(country: str, city: str, theme: str) -> list:
    print(f"Имитация обращения к API для {city} (Тема: {theme})...")
    py_time.sleep(1)

    # Funkcja pomocnicza do tworzenia harmonogramu na każdy dzień
    def generate_hours(o_h, o_m, c_h, c_m):
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        return [{"day": d, "open_time": time(o_h, o_m), "close_time": time(c_h, c_m)} for d in days]

    return [
        
        {
            "name": f"The Great {theme.capitalize()} Spot",
            "image_url": "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800",
            "google_rating": 4.8,
            "description": f"Main {theme.capitalize()} Attraction",
            "price_avg": 45.00,
            "latitude": 52.2297,
            "longitude": 21.0122,
            "hours": generate_hours(9, 0, 19, 0)
        },

        {
            "name": f"{city} Morning Coffee & Bakery",
            "image_url": "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800",
            "google_rating": 4.9,
            "description": "Breakfast & Fresh Bakery",
            "price_avg": 12.50,
            "latitude": 52.2305,
            "longitude": 21.0150,
            "hours": generate_hours(7, 30, 16, 0)
        },

        {
            "name": f"National {theme.capitalize()} Museum of {country}",
            "image_url": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=800",
            "google_rating": 4.6,
            "description": "Historical Museum / Art Gallery",
            "price_avg": 20.00,
            "latitude": 52.2312,
            "longitude": 21.0185,
            "hours": generate_hours(10, 0, 18, 0)
        },

        {
            "name": f"Old Town {city} Fine Dining",
            "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
            "google_rating": 4.7,
            "description": "Traditional & Premium Cuisine",
            "price_avg": 85.00,
            "latitude": 52.2350,
            "longitude": 21.0200,
            "hours": generate_hours(17, 0, 23, 30)
        },

        {
            "name": f"Central {city} Green Park",
            "image_url": "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=800",
            "google_rating": 4.8,
            "description": "Public Park and Recreation",
            "price_avg": 0.00, # Бесплатно
            "latitude": 52.2200,
            "longitude": 21.0100,
            "hours": generate_hours(6, 0, 23, 0)
        },

        {
            "name": f"{city} Neon Lights Club",
            "image_url": "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800",
            "google_rating": 4.3,
            "description": "Live Music & DJ Sets",
            "price_avg": 35.00,
            "latitude": 52.2280,
            "longitude": 21.0050,
            "hours": generate_hours(20, 0, 23, 59) 
        },

        {
            "name": f"Hidden {theme.capitalize()} Gem",
            "image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800",
            "google_rating": 3.9,
            "description": "Local Authentic Spot",
            "price_avg": 8.00,
            "latitude": 52.2400,
            "longitude": 21.0300,
            "hours": generate_hours(12, 0, 20, 0)
        },

        {
            "name": f"{country} Souvenirs & Gifts",
            "image_url": "https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=800",
            "google_rating": 4.2,
            "description": "Memories and Local Crafts",
            "price_avg": 15.00,
            "latitude": 52.2325,
            "longitude": 21.0170,
            "hours": generate_hours(9, 0, 21, 0)
        },

        {
            "name": f"{city} Street Food Corner",
            "image_url": "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?q=80&w=800",
            "google_rating": 4.5,
            "description": "Quick & Tasty Local Food",
            "price_avg": 5.50,
            "latitude": 52.2250,
            "longitude": 21.0120,
            "hours": generate_hours(11, 0, 22, 0)
        },

        {
            "name": f"{city} Skyline Viewpoint",
            "image_url": "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800",
            "google_rating": 4.9,
            "description": "Best Panoramic Views",
            "price_avg": 18.00,
            "latitude": 52.2318,
            "longitude": 21.0060,
            "hours": generate_hours(15, 0, 23, 0)
        }
    ]