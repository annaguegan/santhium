# backend/app/models/pharmacy.py
"""
Modèle SQLAlchemy pour les pharmacies
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import secrets
import string


def generate_tenant_code(length: int = 16) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "PH-" + "".join(secrets.choice(alphabet) for _ in range(length))

from app.models.base import Base


class Pharmacy(Base):
    """Modèle Pharmacie"""
    
    __tablename__ = "pharmacies"
    
    id = Column(Integer, primary_key=True, index=True)
    tenant_code = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
        default=generate_tenant_code,
    )
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
