# backend/app/schemas/document.py
"""
Schémas Pydantic pour les documents
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class DocumentUpload(BaseModel):
    """Schéma pour l'upload d'un document"""
    code: str = Field(..., min_length=6, max_length=6)


class DocumentResponse(BaseModel):
    """Schéma pour la réponse document"""
    id: int
    filename: str
    original_filename: str
    file_size: int
    file_type: str
    uploaded_at: datetime
    is_viewed: bool
    code_id: int
    
    class Config:
        from_attributes = True


class DocumentList(BaseModel):
    """Schéma pour une liste de documents"""
    documents: list[DocumentResponse]
    total: int