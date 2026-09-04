from argostranslate import translate as argos_translate
from langdetect import detect


SUPPORTED_LANGUAGES = {
    "auto": "Automatyczne wykrywanie",
    "pl": "Polski",
    "en": "English",
    "uk": "Українська",
    "ru": "Русский",
    "de": "Deutsch",
    "fr": "Français",
    "es": "Español",
    "it": "Italiano",
    "pt": "Português",
    "nl": "Nederlands",
    "cs": "Čeština",
    "sk": "Slovenčina",
    "hu": "Magyar",
    "ro": "Română",
    "bg": "Български",
    "el": "Ελληνικά",
    "tr": "Türkçe",
    "sv": "Svenska",
    "da": "Dansk",
    "fi": "Suomi",
    "no": "Norsk",
    "zh-CN": "简体中文",
    "ja": "日本語",
    "ko": "한국어"
}


def get_languages():
    return SUPPORTED_LANGUAGES


def normalize_language_code(code: str) -> str:
    """
    Normalizuje kody języków zwracane przez langdetect.
    """

    aliases = {
        "zh-cn": "zh-CN",
        "zh-tw": "zh-CN",
        "mk": "ru"
    }

    return aliases.get(code.lower(), code)


def normalize_argos_language_code(code: str) -> str:
    """
    Zamienia kody używane przez API na kody obsługiwane przez Argos Translate.
    """

    aliases = {
        "zh-CN": "zh"
    }

    return aliases.get(code, code)


def translate(text: str, source: str, target: str):

    # Pusty tekst
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

     
        # AUTOMATYCZNE WYKRYWANIE JĘZYKA


        if source == "auto":

            source = detect(text)
            source = normalize_language_code(source)

            if source not in SUPPORTED_LANGUAGES:
                return {
                    "error": "Nie udało się wykryć języka."
                }


        # KODY DLA ARGOS TRANSLATE


        argos_source = normalize_argos_language_code(source)
        argos_target = normalize_argos_language_code(target)


        # TEN SAM JĘZYK


        if argos_source == argos_target:
            return {
                "translated": text
            }


        # 1. PRÓBA BEZPOŚREDNIEGO TŁUMACZENIA


        translation = argos_translate.get_translation_from_codes(
            argos_source,
            argos_target
        )

        if translation is not None:

            translated_text = translation.translate(text)

            return {
                "translated": translated_text
            }


        # 2. TŁUMACZENIE PRZEZ JĘZYK ANGIELSKI


        # source → English
        first_translation = argos_translate.get_translation_from_codes(
            argos_source,
            "en"
        )

        if first_translation is None:
            return {
                "error": (
                    f"Brak modelu tłumaczeniowego: "
                    f"{source} → en"
                )
            }

        # English → target
        second_translation = argos_translate.get_translation_from_codes(
            "en",
            argos_target
        )

        if second_translation is None:
            return {
                "error": (
                    f"Brak modelu tłumaczeniowego: "
                    f"en → {target}"
                )
            }

        # Pierwszy etap
        intermediate_text = first_translation.translate(text)

        # Drugi etap
        translated_text = second_translation.translate(
            intermediate_text
        )

        return {
            "translated": translated_text
        }

    except Exception as e:

        return {
            "error": str(e)
        }