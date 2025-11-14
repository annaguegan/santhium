"""Schémas Pydantic pour les pharmacies."""

from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, EmailStr, Field


PostalCodeStr = Annotated[str, Field(pattern=r"^\d{4,10}$")]
PhoneStr = Annotated[str, Field(pattern=r"^\d{8,15}$")]


class PharmacyBase(BaseModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


class PharmacyCreate(BaseModel):
    name: str
    city: str
    postal_code: PostalCodeStr
    phone: PhoneStr
    address: Optional[str] = None
    email: Optional[EmailStr] = None
    owner_full_name: Optional[str] = None
    owner_email: EmailStr
    owner_password: Annotated[str, Field(min_length=8)]


class PharmacyResponse(PharmacyBase):
    id: int
    tenant_code: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PharmacyInfo(BaseModel):
    id: int
    name: str
    tenant_code: str
    address: Optional[str]
    city: Optional[str]
    postal_code: Optional[str]
    phone: Optional[str]

    class Config:
        from_attributes = True
