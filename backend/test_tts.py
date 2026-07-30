from app.services.tts import generate_audio

audio = generate_audio(
    text="வணக்கம், உங்கள் ஆவணம் வெற்றிகரமாக வாசிக்கப்பட்டது.",
    language="ta"
)

print(audio)