"""Service de gestion des pharmacies."""

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.pharmacy import Pharmacy, generate_tenant_code
from app.models.user import User
from app.schemas.pharmacy import PharmacyCreate


class PharmacyService:
    """Opérations CRUD pour les pharmacies."""

    def __init__(self, db: Session):
        self.db = db

    def create_pharmacy(self, data: PharmacyCreate) -> Pharmacy:
        """Créer une nouvelle pharmacie (tenant) avec son compte administrateur."""
        if data.email:
            existing_email = self.db.query(Pharmacy).filter(Pharmacy.email == data.email).first()
            if existing_email:
                raise ValueError("Une pharmacie avec cet email existe déjà")

        existing_phone = self.db.query(Pharmacy).filter(Pharmacy.phone == data.phone).first()
        if existing_phone:
            raise ValueError("Une pharmacie avec ce numéro existe déjà")

        existing_user = self.db.query(User).filter(User.email == data.owner_email).first()
        if existing_user:
            raise ValueError("Un compte existe déjà avec cet email")

        pharmacy = Pharmacy(
            name=data.name,
            email=data.email,
            address=data.address,
            city=data.city,
            postal_code=data.postal_code,
            phone=data.phone,
            tenant_code=generate_tenant_code(),
            is_active=True,
        )

        self.db.add(pharmacy)
        self.db.commit()
        self.db.refresh(pharmacy)

        user = User(
            email=data.owner_email,
            hashed_password=get_password_hash(data.owner_password),
            full_name=data.owner_full_name,
            pharmacy_id=pharmacy.id,
            is_active=True,
            is_superuser=False,
        )
        self.db.add(user)
        self.db.commit()

        return pharmacy
