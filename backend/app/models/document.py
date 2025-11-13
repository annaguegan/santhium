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