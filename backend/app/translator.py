from deep_translator import GoogleTranslator

# Lista obsługiwanych języków
SUPPORTED_LANGUAGES = {
    "auto": "Automatyczne wykrywanie",
    "pl": "Polski",
    "en": "English",
    "uk": "Українська",
    "ru": "Русский",
    "de": "Deutsch",
    "fr": "Français",
    "es": "Español",
    "it": "Italiano"
}


def translate(text: str, source: str, target: str):

    # Sprawdzenie, czy tekst nie jest pusty
    if not text.strip():
        return {
            "error": "Tekst nie może być pusty."
        }

    # Sprawdzenie języka źródłowego
    if source not in SUPPORTED_LANGUAGES:
        return {
            "error": "Nieobsługiwany język źródłowy."
        }

    # Sprawdzenie języka docelowego
    if target not in SUPPORTED_LANGUAGES or target == "auto":
        return {
            "error": "Nieobsługiwany język docelowy."
        }

    try:

        translator = GoogleTranslator(
            source=source,
            target=target
        )

        translated_text = translator.translate(text)

        return {
            "translated": translated_text
        }


    except Exception as e:

        return {
            "error": str(e)
        }


def get_languages():

    return [
        {
            "code": code,
            "name": name
        }
        for code, name in SUPPORTED_LANGUAGES.items()
    ]