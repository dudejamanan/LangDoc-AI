from gtts import gTTS
import os
import uuid
def generate_audio(text, language):
    tts = gTTS(
    text=text,
    lang=language,
    slow=False
    )
    filename = f"{uuid.uuid4()}.mp3"
    audio_path = os.path.join(
    "app",
    "static",
    "audio",
    filename
    )
    tts.save(audio_path)
    return audio_path