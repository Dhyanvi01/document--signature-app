from jose import jwt, JWTError
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

# ⭐ ensure .env is loaded
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_access_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # ⭐ ensure user_id stored as string
    if "user_id" in payload:
        payload["user_id"] = str(payload["user_id"])

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        print("JWT DECODE ERROR:", e)   # ⭐ DEBUG PRINT
        return None
