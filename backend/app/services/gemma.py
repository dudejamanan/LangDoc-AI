import os

from dotenv import load_dotenv
from google import genai
from PIL import Image
import json
from google.genai import types

from app.services.prompts import SYSTEM_PROMPT, build_prompt
from app.utils.parser import extract_json
import traceback

# ---------------------------------------
# Load Environment Variables
# ---------------------------------------

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in .env")

# ---------------------------------------
# Initialize Gemma Client
# ---------------------------------------

client = genai.Client(api_key=API_KEY)

QUESTION_SYSTEM_PROMPT = """
You are LangDoc AI.

You help elderly and low-literacy users understand forms and documents.

You are given:
1. The original document image.
2. A structured analysis of the document.
3. A user's question.

Rules:
- Answer only from the document or its context.
- Keep answers short (2-3 sentences).
- Use simple language.
- If the answer is not available in the document, clearly say so.
"""



MODEL_NAME = "gemma-4-31b-it"

# ---------------------------------------
# Explain Document
# ---------------------------------------

def explain_document(image_path: str, language: str):

    try:

        # Load Image
        image = Image.open(image_path)

        # Resize large images for faster inference
        MAX_SIZE = (1600, 1600)
        image.thumbnail(MAX_SIZE)

        prompt = build_prompt(language)

        response = client.models.generate_content(

            model=MODEL_NAME,

            contents=[
                image,
                f"{SYSTEM_PROMPT}\n\n{prompt}"
            ],

            config={
                "temperature":0.1,
                "top_p":0.9,
                "max_output_tokens":2048,
            }
        )

        # Debug (remove before deployment if required)
        print("=" * 80)
        print("FULL RESPONSE")
        print(response)
        print("=" * 80)

        print("TEXT:", response.text)
        print("CANDIDATES:", getattr(response, "candidates", None))
        parsed = extract_json(response.text)

        # Ensure sections always exists
        if "sections" not in parsed or parsed["sections"] is None:
            parsed["sections"] = []

        # Ensure key_points always exists
        if "key_points" not in parsed or parsed["key_points"] is None:
            parsed["key_points"] = []

        # Ensure document_category exists
        if "document_category" not in parsed:
            parsed["document_category"] = "document"

        return parsed

    except Exception as e:

        return {
            "document_category": None,
            "document_type": None,
            "language_detected": None,
            "summary": None,
            "action_required": None,
            "deadline": None,
            "priority": None,
            "estimated_time": None,
            "documents_required": None,
            "key_points": [],
            "sections": [],
            "english_gloss": None,
            "error": str(e)
        }

def answer_question(
    image_path: str,
    analysis: dict,
    question: str,
    language: str
):
    """
    Answer a user's question about the uploaded document.
    """

    try:

        image = Image.open(image_path)

        prompt = f"""
Language: {language}

Document Analysis:
{json.dumps(analysis, indent=2)}

User Question:
{question}

Answer in {language}.

Keep the response short and easy to understand.
"""

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[
                image,
                QUESTION_SYSTEM_PROMPT + "\n\n" + prompt
            ],
            config=types.GenerateContentConfig(
                temperature=0.2,
                top_p=0.8,
                max_output_tokens=512
            )
        )

        return response.text.strip()



    except Exception:
        traceback.print_exc()
        return "Sorry, I couldn't answer that question at the moment."