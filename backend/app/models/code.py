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