from sqlalchemy import Column, Integer, Float, ForeignKey, String
from sqlalchemy.orm import relationship
from app.database import Base

class Signature(Base):
    __tablename__ = "signatures"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)

    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    page = Column(Integer, default=1)

    # ✅ NEW FIELD FOR SIGNATURE IMAGE
    image_path = Column(String, nullable=True)

    document = relationship("Document")
