from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.document import Document
from app.dependencies.auth import get_current_user
from app.utils.file_utils import validate_pdf, generate_secure_filename
from app.core.config import DOCUMENT_UPLOAD_DIR
from app.schemas.document import DocumentOut

router = APIRouter(tags=["Documents"])


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: str | None = Form(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    contents = await validate_pdf(file)

    stored_filename = generate_secure_filename(file.filename)
    file_path = DOCUMENT_UPLOAD_DIR / stored_filename

    with open(file_path, "wb") as f:
        f.write(contents)

    document = Document(
        title=title or file.filename,
        original_filename=file.filename,
        stored_filename=stored_filename,
        file_path=str(file_path),
        file_size=len(contents),
        content_type=file.content_type,
        owner_id=current_user.id,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return {
        "message": "PDF uploaded successfully",
        "document_id": document.id,
        "title": document.title,
        "filename": document.original_filename,
    }


@router.get("/", response_model=List[DocumentOut])
def list_user_documents(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    documents = (
        db.query(Document)
        .filter(Document.owner_id == current_user.id)
        .order_by(Document.created_at.desc())
        .all()
    )
    return documents


@router.get("/{document_id}", response_model=DocumentOut)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.owner_id == current_user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    return document


@router.get("/{document_id}/preview", response_class=FileResponse)
def preview_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.owner_id == current_user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    return FileResponse(
        path=document.file_path,
        media_type="application/pdf",
        filename=document.original_filename,
    )
