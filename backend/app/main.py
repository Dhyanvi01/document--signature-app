from dotenv import load_dotenv
load_dotenv()

from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers.auth import router as auth_router
from app.routers.documents import router as documents_router
from app.routers import signatures
from app.routers import signature_upload


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Document Signature App")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(documents_router, prefix="/documents")
app.include_router(signatures.router)
app.include_router(signature_upload.router)

@app.get("/")
def root():
    return {"status": "API running"}
