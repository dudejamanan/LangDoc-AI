from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.guide_state import sessions
from app.services.tts import generate_audio

router = APIRouter()


class GuideRequest(BaseModel):
    session_id: str
    action: str   # "start" or "next"


@router.post("/guide")
async def guide(request: GuideRequest):

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

    sections = analysis.get("sections", [])

    if not sections:
        raise HTTPException(
            status_code=400,
            detail="This document has no guideable sections."
        )

    # -----------------------------
    # Determine Step
    # -----------------------------

    if request.action == "start":
        session["current_step"] = 0

    elif request.action == "next":
        session["current_step"] += 1

    else:
        raise HTTPException(
            status_code=400,
            detail="Action must be 'start' or 'next'."
        )

    current_step = session["current_step"]

    # -----------------------------
    # Finished?
    # -----------------------------

    if current_step >= len(sections):

        completion_text = (
            "Congratulations! You have completed the form."
        )

        audio_path = generate_audio(
            completion_text,
            language
        )

        audio_url = audio_path.replace(
            "app",
            "/static",
            1
        )

        return {
            "completed": True,
            "message": completion_text,
            "audio_url": audio_url
        }

    # -----------------------------
    # Current Section
    # -----------------------------

    section = sections[current_step]

    speech = (
        f"Step {current_step + 1}. "
        f"{section['title']}. "
        f"{section['instruction']}"
    )

    audio_path = generate_audio(
        speech,
        language
    )

    audio_url = audio_path.replace(
        "app",
        "/static",
        1
    )

    return {
        "completed": False,
        "step": current_step + 1,
        "total_steps": len(sections),
        "section": section,
        "speech": speech,
        "audio_url": audio_url
    }