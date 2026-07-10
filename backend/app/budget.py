from .models import BudgetRequest


def calculate_budget(data: BudgetRequest):

    # Obliczenie kosztu noclegu
    hotel_cost = data.hotel_per_day * data.days

    # Obliczenie kosztu wyżywienia
    food_cost = data.food_per_day * data.days * data.people

    # Koszt transportu
    transport_cost = data.transport

    # Łączny koszt atrakcji
    activities_cost = sum(
        activity.price
        for activity in data.activities
    )

    # Koszt podróży przed dodaniem rezerwy
    subtotal = (
        hotel_cost
        + food_cost
        + transport_cost
        + activities_cost
    )

    # Rezerwa na nieprzewidziane wydatki
    reserve = subtotal * (data.reserve_percent / 100)

    # Całkowity koszt podróży
    total = subtotal + reserve

    # Koszt na jedną osobę
    per_person = total / data.people

    return {
        "currency": data.currency,
        "hotel": round(hotel_cost, 2),
        "food": round(food_cost, 2),
        "transport": round(transport_cost, 2),
        "activities": round(activities_cost, 2),
        "subtotal": round(subtotal, 2),
        "reserve": round(reserve, 2),
        "total": round(total, 2),
        "per_person": round(per_person, 2)
    }