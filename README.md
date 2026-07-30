# 📄 LangDoc AI

> **AI-powered multilingual document assistant that helps elderly and low-literacy users understand official documents and complete forms through voice-guided assistance.**

**Deployed Frontend Link:** https://lang-doc-ai.vercel.app/
 
**Deployed Backend Link:** https://langdoc-ai.onrender.com
 
**Demo Video**: https://youtu.be/xigxZP00VVE

Built for **Build with Gemma Hackathon (GDG VIT Chennai)** using **Gemma 4**.



---

## 🚀 Problem Statement

Millions of citizens struggle to understand government forms, legal notices, medical reports, and official documents due to language barriers and complex terminology.

LangDoc AI bridges this gap by converting complex documents into simple explanations, providing voice-based assistance, and guiding users step-by-step while filling forms.

---

## ✨ Features

### 🌐 Multilingual Support
- English
- Hindi
- Tamil

Users receive explanations entirely in their selected language.

---

### 📷 Document Understanding

Upload or capture a document and LangDoc AI will:

- Detect document type
- Generate a simplified summary
- Identify required actions
- Highlight deadlines
- Estimate priority
- List important points
- Explain technical terms

---

### 📝 Intelligent Form Guidance

If the uploaded document is a form, LangDoc AI automatically:

- Detects every major section
- Explains what information should be filled
- Guides users step-by-step
- Prevents common mistakes while filling forms

---

### 🎙 Voice-First Experience

Designed for elderly users.

Every explanation is converted into natural speech so users can:

- Listen instead of reading
- Replay explanations
- Navigate forms hands-free

---

### 💬 AI Document Assistant

Users can ask questions related to the uploaded document using voice.

Example:

> "What happens if I enter incorrect information?"

LangDoc AI answers using only the uploaded document's context.

---

### 📖 English Glossary

Complex government terminology is simplified into easy-to-understand English definitions.

Example:

- Tatkaal
- Non-ECR
- Surname
- Given Name

---

## 🏗 Architecture

```text
                User
                  │
                  ▼
        Upload Document/Image
                  │
                  ▼
          FastAPI Backend
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
  Gemma 4 Vision         OCR + Analysis
      │
      ▼
Structured JSON Extraction
      │
      ▼
Formatter
      │
      ├─────────────► Voice (TTS)
      │
      ▼
 React Frontend
      │
      ├── Document Summary
      ├── Form Guidance
      ├── Voice Assistant
      └── Q&A
```

---

# 🛠 Tech Stack

## AI

- Gemma 4
- Google GenAI SDK

## Backend

- FastAPI
- Python
- Uvicorn

## Frontend

- React
- Vite

## Speech

- Text-to-Speech (TTS)

---

# 📂 Project Structure

```
LangDoc-AI/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── static/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/LangDoc-AI.git
cd LangDoc-AI
```

---

## Backend

```bash
cd backend

python -m venv .venv
```

Activate environment

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```env
GOOGLE_API_KEY=YOUR_API_KEY
```

Run backend

```bash
uvicorn app.main:app --reload
```

Backend:

```
http://localhost:8000
```

Swagger Docs:

```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# 📡 API Endpoints

## Explain Document

```
POST /api/explain
```

Returns

- Summary
- Actions
- Priority
- Audio
- Session ID

---

## Form Guidance

```
POST /api/guide
```

Actions

- Start Guide
- Next Step

---

## Ask Questions

```
POST /api/ask
```

Ask follow-up questions about the uploaded document.

---

# 🌍 Supported Documents

- Government Notices
- Passport Forms
- Aadhaar Forms
- PAN Applications
- Medical Reports
- Insurance Letters
- Bank Documents
- Utility Bills
- Court Notices
- Registration Forms

---

# 🎯 Target Users

- Elderly citizens
- Low-literacy users
- Regional language speakers
- First-time government service applicants

---

# 💡 Future Improvements

- Field highlighting on uploaded forms
- Live OCR with bounding boxes
- Additional regional languages
- Offline on-device inference
- Speech-to-Speech conversations
- Mobile application

---

# 👥 Team

**Claude Coders**
Manan Dudeja
Arnav Thapliyal
Akshat Singh
Pulkit Taneja

Built for **Build with Gemma Hackathon** hosted by **GDG VIT Chennai**.

---

# 📜 License

This project was developed for the **Build with Gemma Hackathon**.

Feel free to fork, learn, and extend the project.
