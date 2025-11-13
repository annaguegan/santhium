# Structure Backend Python (FastAPI) - Santhium

## 📁 Structure du dossier app/

```
backend/app/
├── main.py                  # Point d'entrée FastAPI
├── __init__.py             # Package Python
│
├── api/                    # Endpoints API
│   ├── __init__.py
│   ├── v1/                # Version 1 de l'API
│   │   ├── __init__.py
│   │   ├── endpoints/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py        # Routes d'authentification
│   │   │   ├── codes.py       # Routes gestion codes/QR
│   │   │   ├── documents.py   # Routes documents
│   │   │   └── health.py      # Healthcheck
│   │   └── router.py      # Agrégation des routes
│
├── core/                   # Configuration & sécurité
│   ├── __init__.py
│   ├── config.py          # Configuration app (variables .env)
│   ├── security.py        # JWT, hash, encryption
│   └── dependencies.py    # Dépendances FastAPI
│
├── models/                 # Modèles SQLAlchemy
│   ├── __init__.py
│   ├── base.py           # Classe de base
│   ├── user.py           # Modèle Utilisateur (pharmacien)
│   ├── pharmacy.py       # Modèle Pharmacie
│   ├── code.py           # Modèle Code/QR
│   └── document.py       # Modèle Document
│
├── schemas/                # Schémas Pydantic (validation)
│   ├── __init__.py
│   ├── user.py           # Schémas User
│   ├── auth.py           # Schémas Auth (login, token)
│   ├── code.py           # Schémas Code
│   └── document.py       # Schémas Document
│
├── services/               # Logique métier
│   ├── __init__.py
│   ├── auth_service.py   # Service authentification
│   ├── code_service.py   # Service gestion codes
│   ├── document_service.py  # Service documents
│   ├── encryption_service.py # Service chiffrement
│   └── email_service.py  # Service emails (optionnel)
│
├── crud/                   # Opérations base de données
│   ├── __init__.py
│   ├── base.py           # CRUD générique
│   ├── user.py           # CRUD User
│   ├── code.py           # CRUD Code
│   └── document.py       # CRUD Document
│
├── db/                     # Base de données
│   ├── __init__.py
│   ├── session.py        # Configuration session DB
│   └── init_db.py        # Initialisation DB
│
├── middleware/             # Middlewares
│   ├── __init__.py
│   ├── cors.py           # Configuration CORS
│   ├── rate_limit.py     # Rate limiting
│   └── logging.py        # Logging des requêtes
│
├── utils/                  # Utilitaires
│   ├── __init__.py
│   ├── validators.py     # Validateurs personnalisés
│   ├── formatters.py     # Formatage données
│   ├── file_handler.py   # Gestion fichiers
│   └── qr_generator.py   # Génération QR codes
│
└── tasks/                  # Tâches asynchrones
    ├── __init__.py
    ├── cleanup.py        # Nettoyage auto des fichiers
    └── notifications.py  # Envoi notifications
```

## 📝 Description détaillée des fichiers clés

### 1. main.py - Point d'entrée

```python
# backend/app/main.py
"""
Point d'entrée de l'application Santhium
Initialise FastAPI, les routes, middlewares et la base de données
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.router import api_router
from app.db.session import engine
from app.models import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie de l'application"""
    # Startup: Créer les tables
    Base.metadata.create_all(bind=engine)
    print("✅ Base de données initialisée")
    yield
    # Shutdown: Nettoyage si nécessaire
    print("👋 Arrêt de l'application")


app = FastAPI(
    title="Santhium API",
    description="API sécurisée pour le transfert de documents médicaux",
    version="1.0.0",
    lifespan=lifespan,
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Route racine"""
    return {
        "message": "Bienvenue sur l'API Santhium",
        "version": "1.0.0",
        "documentation": "/docs"
    }


@app.get("/health")
async def health_check():
    """Healthcheck pour Docker"""
    return {"status": "healthy", "service": "santhium-api"}
```

### 2. core/config.py - Configuration

```python
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
    CODE_EXPIRATION_HOURS: int = 24
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
```

### 3. core/security.py - Sécurité

```python
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
```

### 4. models/user.py - Modèle User

```python
# backend/app/models/user.py
"""
Modèle SQLAlchemy pour les utilisateurs (pharmaciens)
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base


class User(Base):
    """Modèle Utilisateur (pharmacien)"""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # Relations
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id"))
    pharmacy = relationship("Pharmacy", back_populates="users")
    
    codes = relationship("Code", back_populates="created_by_user")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### 5. models/code.py - Modèle Code

```python
# backend/app/models/code.py
"""
Modèle pour les codes de transfert (codes/QR codes)
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta

from app.models.base import Base


class Code(Base):
    """Modèle Code de transfert"""
    
    __tablename__ = "codes"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(6), unique=True, index=True, nullable=False)
    
    # Métadonnées
    is_active = Column(Boolean, default=True)
    expiration_date = Column(DateTime, nullable=False)
    max_uses = Column(Integer, default=1)  # Nombre d'uploads autorisés
    current_uses = Column(Integer, default=0)
    
    # Relations
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id"))
    pharmacy = relationship("Pharmacy", back_populates="codes")
    
    created_by_id = Column(Integer, ForeignKey("users.id"))
    created_by_user = relationship("User", back_populates="codes")
    
    documents = relationship("Document", back_populates="code")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime)
    
    def is_expired(self) -> bool:
        """Vérifier si le code est expiré"""
        return datetime.utcnow() > self.expiration_date
    
    def can_be_used(self) -> bool:
        """Vérifier si le code peut être utilisé"""
        return (
            self.is_active 
            and not self.is_expired() 
            and self.current_uses < self.max_uses
        )
```

### 6. models/document.py - Modèle Document

```python
# backend/app/models/document.py
"""
Modèle pour les documents téléchargés
"""

from sqlalchemy import Column, Integer, String, DateTime, LargeBinary, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base


class Document(Base):
    """Modèle Document médical"""
    
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Informations fichier
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_size = Column(Integer)  # En bytes
    file_type = Column(String)  # Extension
    mime_type = Column(String)
    
    # Contenu chiffré
    encrypted_content = Column(LargeBinary)
    
    # Relations
    code_id = Column(Integer, ForeignKey("codes.id"))
    code = relationship("Code", back_populates="documents")
    
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id"))
    pharmacy = relationship("Pharmacy", back_populates="documents")
    
    # Métadonnées
    is_viewed = Column(Boolean, default=False)
    viewed_at = Column(DateTime)
    deletion_date = Column(DateTime)  # Date de suppression auto
    
    # Timestamps
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    def calculate_deletion_date(self, retention_days: int = 30):
        """Calculer la date de suppression automatique"""
        from datetime import timedelta
        self.deletion_date = datetime.utcnow() + timedelta(days=retention_days)
```

### 7. schemas/auth.py - Schémas Auth

```python
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
```

### 8. schemas/document.py - Schémas Document

```python
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
```

### 9. api/v1/endpoints/auth.py - Routes Auth

```python
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
```

### 10. api/v1/endpoints/codes.py - Routes Codes

```python
# backend/app/api/v1/endpoints/codes.py
"""
Routes de gestion des codes/QR codes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.schemas.code import CodeCreate, CodeResponse
from app.services.code_service import CodeService
from app.models.user import User

router = APIRouter(prefix="/codes", tags=["codes"])


@router.post("/generate", response_model=CodeResponse)
async def generate_code(
    code_data: CodeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Générer un nouveau code de transfert
    
    Nécessite authentification (pharmacien)
    """
    code_service = CodeService(db)
    
    code = code_service.create_code(
        user_id=current_user.id,
        pharmacy_id=current_user.pharmacy_id,
        expiration_hours=code_data.expiration_hours
    )
    
    return code


@router.post("/validate")
async def validate_code(
    code: str,
    db: Session = Depends(get_db)
):
    """
    Valider un code avant upload
    
    Accessible sans authentification (patient)
    """
    code_service = CodeService(db)
    
    is_valid = code_service.validate_code(code)
    
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Code invalide ou expiré"
        )
    
    return {"valid": True, "message": "Code valide"}


@router.get("/active", response_model=list[CodeResponse])
async def get_active_codes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupérer tous les codes actifs du pharmacien"""
    code_service = CodeService(db)
    
    codes = code_service.get_active_codes(
        pharmacy_id=current_user.pharmacy_id
    )
    
    return codes
```

### 11. api/v1/endpoints/documents.py - Routes Documents

```python
# backend/app/api/v1/endpoints/documents.py
"""
Routes de gestion des documents
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io

from app.core.dependencies import get_db, get_current_user
from app.schemas.document import DocumentResponse, DocumentList
from app.services.document_service import DocumentService
from app.models.user import User

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    code: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload d'un document par un patient
    
    Accessible sans authentification (utilise le code)
    """
    document_service = DocumentService(db)
    
    try:
        # Lire le contenu du fichier
        content = await file.read()
        
        # Upload et chiffrement
        document = document_service.upload_document(
            code=code,
            filename=file.filename,
            content=content,
            content_type=file.content_type
        )
        
        return document
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de l'upload")


@router.get("", response_model=DocumentList)
async def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupérer tous les documents de la pharmacie"""
    document_service = DocumentService(db)
    
    documents = document_service.get_pharmacy_documents(
        pharmacy_id=current_user.pharmacy_id
    )
    
    return {
        "documents": documents,
        "total": len(documents)
    }


@router.get("/{document_id}/download")
async def download_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Télécharger un document (déchiffré)"""
    document_service = DocumentService(db)
    
    try:
        # Récupérer et déchiffrer
        document, decrypted_content = document_service.download_document(
            document_id=document_id,
            pharmacy_id=current_user.pharmacy_id
        )
        
        # Retourner le fichier
        return StreamingResponse(
            io.BytesIO(decrypted_content),
            media_type=document.mime_type,
            headers={
                "Content-Disposition": f"attachment; filename={document.original_filename}"
            }
        )
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Supprimer un document"""
    document_service = DocumentService(db)
    
    try:
        document_service.delete_document(
            document_id=document_id,
            pharmacy_id=current_user.pharmacy_id
        )
        return {"message": "Document supprimé avec succès"}
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
```

### 12. services/code_service.py - Service Codes

```python
# backend/app/services/code_service.py
"""
Logique métier pour la gestion des codes
"""

from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets
import string

from app.models.code import Code
from app.core.config import settings


class CodeService:
    """Service de gestion des codes de transfert"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def generate_unique_code(self, length: int = 6) -> str:
        """Générer un code unique alphanumérique"""
        while True:
            code = ''.join(
                secrets.choice(string.ascii_uppercase + string.digits)
                for _ in range(length)
            )
            # Vérifier l'unicité
            existing = self.db.query(Code).filter(Code.code == code).first()
            if not existing:
                return code
    
    def create_code(
        self, 
        user_id: int, 
        pharmacy_id: int,
        expiration_hours: int = None
    ) -> Code:
        """Créer un nouveau code"""
        if expiration_hours is None:
            expiration_hours = settings.CODE_EXPIRATION_HOURS
        
        code = Code(
            code=self.generate_unique_code(),
            pharmacy_id=pharmacy_id,
            created_by_id=user_id,
            expiration_date=datetime.utcnow() + timedelta(hours=expiration_hours),
            is_active=True
        )
        
        self.db.add(code)
        self.db.commit()
        self.db.refresh(code)
        
        return code
    
    def validate_code(self, code_str: str) -> bool:
        """Valider un code"""
        code = self.db.query(Code).filter(Code.code == code_str).first()
        
        if not code:
            return False
        
        return code.can_be_used()
    
    def increment_usage(self, code_str: str):
        """Incrémenter l'utilisation d'un code"""
        code = self.db.query(Code).filter(Code.code == code_str).first()
        if code:
            code.current_uses += 1
            code.last_used_at = datetime.utcnow()
            self.db.commit()
    
    def get_active_codes(self, pharmacy_id: int) -> list[Code]:
        """Récupérer les codes actifs d'une pharmacie"""
        return self.db.query(Code).filter(
            Code.pharmacy_id == pharmacy_id,
            Code.is_active == True,
            Code.expiration_date > datetime.utcnow()
        ).all()
```

### 13. services/document_service.py - Service Documents

```python
# backend/app/services/document_service.py
"""
Logique métier pour la gestion des documents
"""

from sqlalchemy.orm import Session
from datetime import datetime
import os

from app.models.document import Document
from app.models.code import Code
from app.core.security import encrypt_file, decrypt_file
from app.core.config import settings


class DocumentService:
    """Service de gestion des documents"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def upload_document(
        self,
        code: str,
        filename: str,
        content: bytes,
        content_type: str
    ) -> Document:
        """Upload et chiffrement d'un document"""
        
        # Valider le code
        code_obj = self.db.query(Code).filter(Code.code == code).first()
        if not code_obj or not code_obj.can_be_used():
            raise ValueError("Code invalide ou expiré")
        
        # Valider la taille
        max_size = settings.MAX_FILE_SIZE_MB * 1024 * 1024
        if len(content) > max_size:
            raise ValueError(f"Fichier trop volumineux (max {settings.MAX_FILE_SIZE_MB}MB)")
        
        # Valider le type
        file_ext = filename.split('.')[-1].lower()
        allowed = settings.ALLOWED_EXTENSIONS.split(',')
        if file_ext not in allowed:
            raise ValueError(f"Type de fichier non autorisé. Autorisés: {allowed}")
        
        # Chiffrer le contenu
        encrypted_content = encrypt_file(content)
        
        # Créer le document
        document = Document(
            filename=f"{datetime.utcnow().timestamp()}_{filename}",
            original_filename=filename,
            file_size=len(content),
            file_type=file_ext,
            mime_type=content_type,
            encrypted_content=encrypted_content,
            code_id=code_obj.id,
            pharmacy_id=code_obj.pharmacy_id
        )
        
        # Calculer date de suppression auto
        document.calculate_deletion_date(settings.DATA_RETENTION_DAYS)
        
        self.db.add(document)
        
        # Incrémenter l'utilisation du code
        code_obj.current_uses += 1
        code_obj.last_used_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(document)
        
        return document
    
    def get_pharmacy_documents(self, pharmacy_id: int) -> list[Document]:
        """Récupérer tous les documents d'une pharmacie"""
        return self.db.query(Document).filter(
            Document.pharmacy_id == pharmacy_id
        ).order_by(Document.uploaded_at.desc()).all()
    
    def download_document(
        self, 
        document_id: int, 
        pharmacy_id: int
    ) -> tuple[Document, bytes]:
        """Récupérer et déchiffrer un document"""
        document = self.db.query(Document).filter(
            Document.id == document_id,
            Document.pharmacy_id == pharmacy_id
        ).first()
        
        if not document:
            raise ValueError("Document non trouvé")
        
        # Déchiffrer
        decrypted_content = decrypt_file(document.encrypted_content)
        
        # Marquer comme vu
        if not document.is_viewed:
            document.is_viewed = True
            document.viewed_at = datetime.utcnow()
            self.db.commit()
        
        return document, decrypted_content
    
    def delete_document(self, document_id: int, pharmacy_id: int):
        """Supprimer un document"""
        document = self.db.query(Document).filter(
            Document.id == document_id,
            Document.pharmacy_id == pharmacy_id
        ).first()
        
        if not document:
            raise ValueError("Document non trouvé")
        
        self.db.delete(document)
        self.db.commit()
```

### 14. core/dependencies.py - Dépendances FastAPI

```python
# backend/app/core/dependencies.py
"""
Dépendances FastAPI (injection de dépendances)
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.core.config import settings
from app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")


def get_db():
    """Dépendance pour obtenir une session DB"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Récupérer l'utilisateur courant depuis le token JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user
```

### 15. db/session.py - Session DB

```python
# backend/app/db/session.py
"""
Configuration de la session SQLAlchemy
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from app.core.config import settings

# Créer l'engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Vérifier la connexion avant utilisation
    echo=settings.DEBUG   # Logger les requêtes SQL en debug
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base pour les modèles
Base = declarative_base()
```

## 🔄 Workflow Backend

### Authentification (Pharmacien)
1. POST `/api/v1/auth/login` → Token JWT
2. Token stocké dans localStorage (frontend)
3. Token inclus dans headers Authorization

### Génération de code
1. POST `/api/v1/codes/generate` (authentifié)
2. Code stocké en DB avec expiration
3. QR code généré côté frontend

### Upload document (Patient)
1. POST `/api/v1/documents/upload` (non authentifié, utilise code)
2. Validation du code
3. Chiffrement du fichier
4. Stockage en DB

### Récupération documents (Pharmacien)
1. GET `/api/v1/documents` (authentifié)
2. Liste des documents de la pharmacie
3. GET `/api/v1/documents/{id}/download` pour télécharger

## ✅ À faire ensuite

1. Créer la structure de dossiers
2. Implémenter les modèles manquants (Pharmacy)
3. Ajouter les migrations Alembic
4. Implémenter les tâches de nettoyage automatique
5. Ajouter les tests unitaires
6. Configurer le logging
7. Implémenter le rate limiting

## 📦 Commandes utiles

```bash
# Créer les tables
python -c "from app.db.session import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"

# Lancer le serveur
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Générer une clé de chiffrement
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```