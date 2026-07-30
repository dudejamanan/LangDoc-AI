import os
import shutil
import uuid

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services.gemma import explain_document
from app.services.tts import generate_audio
from app.services.formatter import json_to_speech

router = APIRouter()

UPLOAD_DIR = "app/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/explain")
async def explain(
    image: UploadFile = File(...),
    language: str = Form(...)
):

    # Validate uploaded file
    if not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not an image."
        )

    # Generate unique filename
    extension = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{extension}"

    image_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    # Save uploaded image
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    try:

        # Step 1: Get structured JSON from Gemma
        result = explain_document(
            image_path=image_path,
            language=language
        )

        # Step 2: Convert JSON into natural speech
        speech = json_to_speech(
            result,
            language
        )

        # Step 3: Generate audio
        audio_path = generate_audio(
            text=speech,
            language=language
        )

        # Step 4: Convert filesystem path to URL
        audio_url = audio_path.replace(
            "app",
            "/static",
            1
        )

        # Step 5: Return everything
        return {
            "document": result,
            "speech": speech,
            "audio_url": audio_url
        }

    finally:

        if os.path.exists(image_path):
            os.remove(image_path)