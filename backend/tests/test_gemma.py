from pathlib import Path
from app.services.gemma import explain_document

image_path = Path(__file__).parent / "sample_documents" / "sample.jpg"

result = explain_document(
    str(image_path),
    "Hindi"
)

print(result)