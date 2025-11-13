# backend/app/core/security.py
"""
Fonctions de sécurité : JWT, hachage, chiffrement
"""

from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet

from app.core.config import settings

# Hachage de mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Chiffrement de fichiers
cipher_suite = Fernet(settings.ENCRYPTION_KEY.encode())


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Créer un token JWT"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifier un mot de passe"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hasher un mot de passe"""
    return pwd_context.hash(password)


def encrypt_file(file_content: bytes) -> bytes:
    """Chiffrer un fichier"""
    return cipher_suite.encrypt(file_content)


def decrypt_file(encrypted_content: bytes) -> bytes:
    """Déchiffrer un fichier"""
    return cipher_suite.decrypt(encrypted_content)