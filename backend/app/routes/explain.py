import os
import shutil
import uuid

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services.gemma import explain_document

router = APIRouter()

UPLOAD_DIR = "app/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/explain")
async def explain(
    image: UploadFile = File(...),
    language: str = Form(...)
):

    # Check image type
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

        result = explain_document(
            image_path=image_path,
            language=language
        )

        return result

    finally:

        # Delete uploaded image after processing
        if os.path.exists(image_path):
            os.remove(image_path)