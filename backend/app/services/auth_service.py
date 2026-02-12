from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.password import hash_password, verify_password
from app.utils.jwt import create_access_token

def register_user(db: Session, name: str, email: str, password: str):
    user = User(
        name=name,
        email=email,
        password=hash_password(password)
    )
    db.add(user)
    db.commit()
    return user

def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        return None

    return create_access_token({"user_id": user.id})
