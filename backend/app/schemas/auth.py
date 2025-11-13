# backend/app/schemas/auth.py
"""
Schémas Pydantic pour l'authentification
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    """Schéma pour la requête de connexion"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schéma pour la réponse token"""
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    """Schéma pour la réponse utilisateur"""
    id: int
    email: str
    full_name: Optional[str]
    pharmacy_id: Optional[int]
    
    class Config:
        from_attributes = True