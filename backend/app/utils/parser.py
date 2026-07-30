import json
import re


def extract_json(response_text: str):
    """
    Extracts valid JSON from an LLM response.

    Handles:
    - Plain JSON
    - Markdown-wrapped JSON
    - Extra text before/after JSON

    Returns:
        dict
    Raises:
        ValueError
    """

    # -------------------------
    # Case 1
    # Already valid JSON
    # -------------------------

    try:
        return json.loads(response_text)
    except Exception:
        pass

    # -------------------------
    # Case 2
    # Remove Markdown
    # -------------------------

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

    # -------------------------
    # Case 3
    # Find first JSON object
    # -------------------------

    match = re.search(
        r"\{.*\}",
        cleaned,
        re.DOTALL
    )

    if match:

        try:
            return json.loads(match.group())
        except Exception:
            pass

    raise ValueError("Could not parse JSON response.")