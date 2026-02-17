from pydantic import BaseModel
from datetime import datetime

class DocumentOut(BaseModel):
    id: int
    title: str | None = None
    original_filename: str
    created_at: datetime

    class Config:
        from_attributes = True
