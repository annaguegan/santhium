"""Logique d'authentification et de gestion des utilisateurs."""

from datetime import timedelta
from typing import Dict, Any

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User
from app.models.pharmacy import Pharmacy


class AuthService:
    """Service d'authentification des pharmaciens."""

    def __init__(self, db: Session):
        self.db = db

    def _create_token_payload(self, user: User) -> Dict[str, Any]:
        """Génère la réponse standard attendue par les schemas FastAPI."""
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
        }

    def authenticate(self, email: str, password: str) -> Dict[str, Any]:
        """Vérifie les identifiants et retourne un token si tout est valide."""
        user = self.db.query(User).filter(User.email == email).first()

        if not user or not verify_password(password, user.hashed_password):
            raise ValueError("Identifiants invalides")

        if not user.is_active:
            raise ValueError("Utilisateur inactif")

        return self._create_token_payload(user)

    def register(self, email: str, password: str, full_name: str, pharmacy_code: str) -> Dict[str, Any]:
        """Crée un nouvel utilisateur pharmacien lié à une pharmacie."""
        existing = self.db.query(User).filter(User.email == email).first()
        if existing:
            raise ValueError("Un utilisateur avec cet email existe déjà")

        normalized_code = pharmacy_code.strip().upper()
        pharmacy = (
            self.db.query(Pharmacy)
            .filter(Pharmacy.tenant_code == normalized_code)
            .first()
        )
        if not pharmacy:
            raise ValueError("Code pharmacie invalide")
        if not pharmacy.is_active:
            raise ValueError("Pharmacie inactive, contactez le support")

        user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            pharmacy_id=pharmacy.id,
            is_active=True,
            is_superuser=False,
        )

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return self._create_token_payload(user)
