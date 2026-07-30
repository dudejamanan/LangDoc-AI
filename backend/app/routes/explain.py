import os
import shutil
import uuid

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services.gemma import explain_document
from app.services.tts import generate_audio
from app.services.formatter import json_to_speech
from app.services.guide_state import sessions

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

        # Step 1: Analyze document
        result = explain_document(
            image_path=image_path,
            language=language
        )

        # Step 2: Convert JSON to speech
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
        audio_url = "/static/audio/" + os.path.basename(audio_path)

        # Step 5: Create session
        session_id = str(uuid.uuid4())

        sessions[session_id] = {
            "analysis": result,
            "language": language,
            "image_path": image_path,
            "current_step": 0
        }

        # Step 6: Return response
        return {
            "success": True,
            "session_id": session_id,
            "document": result,
            "speech": speech,
            "audio_url": audio_url
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )