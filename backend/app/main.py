from fastapi import FastAPI

from .models import TranslationRequest, BudgetRequest
from .translator import translate, get_languages
from .budget import calculate_budget

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