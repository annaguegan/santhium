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