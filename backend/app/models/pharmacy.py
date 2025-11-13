# backend/app/models/pharmacy.py
"""
Modèle SQLAlchemy pour les pharmacies
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base


class Pharmacy(Base):
    """Modèle Pharmacie"""
    
    __tablename__ = "pharmacies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String)
    city = Column(String)
    postal_code = Column(String)
    phone = Column(String)
    email = Column(String)
    
    is_active = Column(Boolean, default=True)
    
    # Relations
    users = relationship("User", back_populates="pharmacy")
    codes = relationship("Code", back_populates="pharmacy")
    documents = relationship("Document", back_populates="pharmacy")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)