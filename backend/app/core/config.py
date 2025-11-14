# backend/app/core/config.py
"""
Configuration de l'application à partir des variables d'environnement
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Configuration globale de l'application"""
    
    # Environnement
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Base de données
    DATABASE_URL: str
    
    # Sécurité
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Chiffrement
    ENCRYPTION_KEY: str
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"
    
    # Fichiers
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: str = "pdf,jpg,jpeg,png"
    UPLOAD_FOLDER: str = "/app/uploads"
    
    # RGPD/HDS
    DATA_RETENTION_DAYS: int = 30
    AUTO_DELETE_ENABLED: bool = True
    CODE_EXPIRATION_HOURS: int = 1
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
