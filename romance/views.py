import json

from django.shortcuts import render


MESSAGES = [
    "Cada día contigo se siente como un regalo.",
    "Tu sonrisa convierte cualquier momento en algo bonito.",
    "Hice esta pequeña sorpresa para recordarte lo especial que eres.",
]


def home(request):
    return render(
        request,
        "index.html",
        {
            "messages": MESSAGES,
            "first_message": MESSAGES[0],
            "romantic_messages_json": json.dumps(MESSAGES, ensure_ascii=False),
        },
    )


def tulipan(request):
    return render(request, "tulipan.html")