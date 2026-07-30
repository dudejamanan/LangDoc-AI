import json
import os

from dotenv import load_dotenv
from google import genai
from PIL import Image

from app.services.prompts import SYSTEM_PROMPT, build_prompt

# -------------------------
# Load Environment Variables
# -------------------------

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in .env")

# -------------------------
# Initialize Client
# -------------------------

client = genai.Client(api_key=API_KEY)

# -------------------------
# Model Name
# -------------------------

MODEL_NAME = "gemma-4-31b-it"

def explain_document(image_path: str, language: str):

    try:

        image = Image.open(image_path)

        prompt = build_prompt(language)

        response = client.models.generate_content(

            model=MODEL_NAME,

            contents=[
                SYSTEM_PROMPT,
                prompt,
                image
            ]
        )

        return json.loads(response.text)

    except Exception as e:

        return {

            "error": str(e)
        }