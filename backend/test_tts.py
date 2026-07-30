from app.services.formatter import json_to_speech
from app.services.tts import generate_audio

sample_json = {
    "document_type": "Rent Control Registration Form",
    "summary": "This form is used to register a rented house under government rules.",
    "action_required": "Fill in the house address, landlord name, phone number and sign the form.",
    "deadline": None,
    "priority": "Medium",
    "key_points": [
        "Fill the complete address.",
        "Enter the landlord's phone number.",
        "Sign before submitting."
    ]
}

speech = json_to_speech(sample_json)

print("Generated Speech:\n")
print(speech)

audio = generate_audio(
    text=speech,
    language="en"
)

print("\nAudio saved at:")
print(audio)