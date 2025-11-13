# backend/app/api/v1/endpoints/auth.py
"""
Routes d'authentification
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Connexion d'un pharmacien
    
    - **email**: Email du pharmacien
    - **password**: Mot de passe
    
    Returns:
        Token JWT et informations utilisateur
    """
    auth_service = AuthService(db)
    
    try:
        result = auth_service.authenticate(
            email=login_data.email,
            password=login_data.password
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )


@router.post("/register", response_model=TokenResponse)
async def register(
    user_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """Inscription d'un nouveau pharmacien"""
    auth_service = AuthService(db)
    
    try:
        result = auth_service.register(
            email=user_data.email,
            password=user_data.password
        )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )