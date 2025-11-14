"""Schémas Pydantic pour les codes de transfert."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CodeCreate(BaseModel):
    """Payload pour la génération d'un code."""
    expiration_hours: Optional[int] = None


class CodeBase(BaseModel):
    """Champs communs aux réponses Code."""
    id: int
    code: str
    is_active: bool
    expiration_date: datetime
    max_uses: int
    current_uses: int
    pharmacy_id: Optional[int]
    created_by_id: Optional[int]
    created_at: Optional[datetime]
    last_used_at: Optional[datetime]

    class Config:
        from_attributes = True


class CodeResponse(CodeBase):
    """Réponse retournée au frontend."""
    pass
