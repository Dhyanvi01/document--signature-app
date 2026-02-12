from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # bcrypt max length = 72 bytes
    password = password.strip()
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password too long (max 72 characters)")
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
