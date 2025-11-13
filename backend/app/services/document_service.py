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