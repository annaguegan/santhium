# backend/app/schemas/auth.py
"""
Schémas Pydantic pour l'authentification
"""

from __future__ import annotations

from pydantic import BaseModel, EmailStr
from typing import Optional

from app.schemas.pharmacy import PharmacyInfo

class LoginRequest(BaseModel):
    """Schéma pour la requête de connexion"""
    email: EmailStr
    password: str


class RegisterRequest(LoginRequest):
    """Schéma pour la requête d'inscription"""
    full_name: str
    pharmacy_code: str


class UserResponse(BaseModel):
    """Schéma pour la réponse utilisateur"""
    id: int
    email: str
    full_name: Optional[str]
    pharmacy_id: Optional[int]
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schéma pour la réponse token"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserProfileResponse(UserResponse):
    pharmacy: Optional[PharmacyInfo]
