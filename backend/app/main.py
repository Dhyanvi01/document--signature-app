from dotenv import load_dotenv
load_dotenv()


from fastapi import FastAPI
from app.database import Base, engine
from app.routers.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Document Signature App")

app.include_router(auth_router)

@app.get("/")
def root():
    return {"status": "API running"}
