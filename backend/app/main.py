from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes.explain import router as explain_router
# from app.routes.ask import router as ask_router   # Stretch Goal

app = FastAPI(
    title="LangDoc API",
    description="Backend API for multilingual document understanding using Gemma 4",
    version="1.0.0"
)

# ----------------------------
# CORS
# ----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Restrict later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Static Files
# ----------------------------

app.mount(
    "/static",
    StaticFiles(directory="app/static"),
    name="static"
)

# ----------------------------
# Routes
# ----------------------------

app.include_router(
    explain_router,
    prefix="/api",
    tags=["Explain"]
)

# app.include_router(
#     ask_router,
#     prefix="/api",
#     tags=["Ask"]
# )

# ----------------------------
# Root Endpoint
# ----------------------------

@app.get("/")
def root():
    return {
        "message": "LangDoc Backend Running"
    }