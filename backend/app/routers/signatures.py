from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.signature import Signature
from app.schemas.signature import SignatureCreate
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/signatures", tags=["signatures"])

@router.post("/")
def create_signature(
    data: SignatureCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    sig = Signature(
        document_id=data.document_id,
        x=data.x,
        y=data.y,
        page=data.page
    )

    db.add(sig)
    db.commit()
    db.refresh(sig)

    return sig
