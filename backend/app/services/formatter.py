MESSAGES = {
    "en": {
        "greeting": "Hello. I have successfully read your document.",
        "document_intro": "This document is a {}.",
        "form_intro": "This is a {}.",
        "form_ready": "I can guide you through filling this form one section at a time. Press the Guide Me button whenever you are ready.",
        "important": "This document is important. Please complete it as soon as possible.",
        "deadline": "Please complete this before {}.",
        "remember": "Here are the important points you should remember.",
        "closing": "I hope this explanation was helpful."
    },

    "hi": {
        "greeting": "नमस्ते। मैंने आपका दस्तावेज़ पढ़ लिया है।",
        "document_intro": "यह एक {} है।",
        "form_intro": "यह एक {} है।",
        "form_ready": "मैं आपको इस फ़ॉर्म को एक-एक भाग करके भरने में मदद कर सकता हूँ। जब आप तैयार हों, Guide Me बटन दबाइए।",
        "important": "यह एक महत्वपूर्ण दस्तावेज़ है। कृपया इसे जल्द से जल्द पूरा करें।",
        "deadline": "कृपया इसे {} से पहले पूरा करें।",
        "remember": "कृपया इन महत्वपूर्ण बातों को याद रखें।",
        "closing": "मुझे आशा है कि यह जानकारी आपके लिए उपयोगी रही होगी।"
    },

    "ta": {
        "greeting": "வணக்கம். உங்கள் ஆவணத்தை நான் வெற்றிகரமாக படித்துள்ளேன்.",
        "document_intro": "இது ஒரு {}.",
        "form_intro": "இது ஒரு {}.",
        "form_ready": "இந்த படிவத்தை ஒரு பகுதி வீதம் நிரப்ப நான் உங்களுக்கு உதவுவேன். தயார் ஆனதும் Guide Me பொத்தானை அழுத்துங்கள்.",
        "important": "இது ஒரு முக்கியமான ஆவணம். தயவுசெய்து விரைவில் இதை முடிக்கவும்.",
        "deadline": "{} க்குள் இதை முடிக்கவும்.",
        "remember": "இந்த முக்கிய குறிப்புகளை நினைவில் கொள்ளுங்கள்.",
        "closing": "இந்த தகவல் உங்களுக்கு பயனுள்ளதாக இருந்திருக்கும் என்று நம்புகிறேன்."
    }
}


def json_to_speech(data, language="en"):

    messages = MESSAGES.get(language, MESSAGES["en"])

    category = data.get("document_category", "document")
    document_type = data.get("document_type", "")
    summary = data.get("summary", "")
    action_required = data.get("action_required", "")
    deadline = data.get("deadline")
    priority = data.get("priority") or ""
    key_points = data.get("key_points", [])
    estimated_time = data.get("estimated_time")

    speech = []

    speech.append(messages["greeting"])

    # ------------------------------------
    # FORM
    # ------------------------------------

    if category == "form":

        if document_type:
            speech.append(
                messages["form_intro"].format(document_type)
            )

        if summary:
            speech.append(summary)

        if estimated_time:
            speech.append(
                f"It should take about {estimated_time} to complete."
            )

        speech.append(messages["form_ready"])

        speech.append(messages["closing"])

        return "\n".join(speech)

    # ------------------------------------
    # DOCUMENT
    # ------------------------------------

    if document_type:
        speech.append(
            messages["document_intro"].format(document_type)
        )

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