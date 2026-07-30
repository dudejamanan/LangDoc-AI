from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.guide_state import sessions
from app.services.gemma import answer_question
from app.services.tts import generate_audio

router = APIRouter()


class AskRequest(BaseModel):
    session_id: str
    question: str


@router.post("/ask")
async def ask(request: AskRequest):

    # -----------------------------
    # Validate Session
    # -----------------------------

    if request.session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found."
        )

    session = sessions[request.session_id]

    analysis = session["analysis"]
    language = session["language"]
    image_path = session["image_path"]

    # -----------------------------
    # Ask Gemma
    # -----------------------------

    answer = answer_question(
        image_path=image_path,
        analysis=analysis,
        question=request.question,
        language=language
    )

    # -----------------------------
    # Generate Audio
    # -----------------------------

    audio_path = generate_audio(
        answer,
        language
    )

    audio_url = audio_path.replace(
        "app",
        "/static",
        1
    )

    # -----------------------------
    # Return
    # -----------------------------

    return {
        "question": request.question,
        "answer": answer,
        "audio_url": audio_url
    }