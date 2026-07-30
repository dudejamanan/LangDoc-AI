"""
Simple in-memory session storage.

Structure:

sessions = {
    session_id: {
        "analysis": {},
        "language": "en",
        "image_path": "...",
        "current_step": 0
    }
}
"""

sessions = {}