MESSAGES = {
    "en": {
        "greeting": "Hello. I have successfully read your document.",
        "important": "This document is important. Please complete it as soon as possible.",
        "deadline": "Please complete this before {}.",
        "remember": "Please remember these important points.",
        "closing": "I hope this explanation was helpful."
    },

    "hi": {
        "greeting": "नमस्ते। मैंने आपका दस्तावेज़ पढ़ लिया है।",
        "important": "यह एक महत्वपूर्ण दस्तावेज़ है। कृपया इसे जल्द से जल्द पूरा करें।",
        "deadline": "कृपया इसे {} से पहले पूरा करें।",
        "remember": "कृपया इन महत्वपूर्ण बातों को याद रखें।",
        "closing": "मुझे आशा है कि यह जानकारी आपके लिए उपयोगी रही होगी।"
    },

    "ta": {
        "greeting": "வணக்கம். உங்கள் ஆவணத்தை நான் வெற்றிகரமாக படித்துள்ளேன்.",
        "important": "இது ஒரு முக்கியமான ஆவணம். தயவுசெய்து விரைவில் இதை முடிக்கவும்.",
        "deadline": "{} க்குள் இதை முடிக்கவும்.",
        "remember": "இந்த முக்கிய குறிப்புகளை நினைவில் கொள்ளுங்கள்.",
        "closing": "இந்த தகவல் உங்களுக்கு பயனுள்ளதாக இருந்திருக்கும் என்று நம்புகிறேன்."
    }
}
def json_to_speech(data, language="en"):
    messages = MESSAGES.get(language, MESSAGES["en"])
    summary = data.get("summary", "")
    document_type = data.get("document_type", "")
    action_required = data.get("action_required", "")
    deadline = data.get("deadline")
    priority = data.get("priority", "")
    key_points = data.get("key_points", [])

    speech = []
    speech.append(messages["greeting"])
    if document_type:
        speech.append(f"This document is a {document_type}.")

    if summary:
        speech.append(summary)

    if action_required:
        speech.append(action_required)

    if deadline:
        speech.append(
            messages["deadline"].format(deadline)
        )

    if priority.lower() == "high":
        speech.append(messages["important"])

    if key_points:
        speech.append(messages["remember"])

        for point in key_points:
            speech.append(point)
    speech.append(messages["closing"])
    return "\n".join(speech)