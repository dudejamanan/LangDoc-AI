import json
import re


def extract_json(response_text: str):
    """
    Extracts valid JSON from an LLM response.

    Handles:
    - Plain JSON
    - Markdown wrapped JSON
    - Extra text before JSON
    - Extra text after JSON
    - Multiple lines
    """

    if not response_text:
        raise ValueError("Empty response received from model.")

    # ---------------------------------
    # Try parsing directly
    # ---------------------------------

    try:
        return json.loads(response_text)
    except Exception:
        pass

    # ---------------------------------
    # Remove Markdown
    # ---------------------------------

    cleaned = (
        response_text
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    try:
        return json.loads(cleaned)
    except Exception:
        pass

    # ---------------------------------
    # Extract first JSON object
    # ---------------------------------

    match = re.search(
        r"\{[\s\S]*\}",
        cleaned
    )

    if match:

        json_text = match.group()

        try:
            return json.loads(json_text)
        except Exception:
            pass

    # ---------------------------------
    # Nothing worked
    # ---------------------------------

    raise ValueError(
        f"Could not parse JSON.\n\nModel Output:\n{response_text}"
    )