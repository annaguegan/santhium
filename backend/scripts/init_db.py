# backend/scripts/init_db.py
"""
Script pour initialiser la base de données et créer un utilisateur de test
"""

import sys
import os

# Ajouter le dossier parent au path pour pouvoir importer les modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models import Base, User, Pharmacy
from app.models.pharmacy import generate_tenant_code
from app.core.security import get_password_hash

def init_database():
    """Initialiser la base de données et créer les tables"""
    print("🔧 Création des tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables créées avec succès!")

def ensure_pharmacy(db: Session, name: str, city: str, code: str, phone: str, email: str):
    """Créer ou récupérer une pharmacie avec un code tenant."""
    pharmacy = db.query(Pharmacy).filter(Pharmacy.email == email).first()
    if pharmacy:
        if not pharmacy.tenant_code:
            pharmacy.tenant_code = generate_tenant_code()
            db.commit()
            db.refresh(pharmacy)
        print(f"⚠️  Pharmacie '{name}' existe déjà (Code: {pharmacy.tenant_code})")
        return pharmacy
    
    pharmacy = Pharmacy(
        name=name,
        address=f"123 Rue de {city}",
        city=city,
        postal_code="75001",
        phone=phone,
        email=email,
        tenant_code=code or generate_tenant_code()
    )
    db.add(pharmacy)
    db.commit()
    db.refresh(pharmacy)
    print(f"✅ Pharmacie créée: {pharmacy.name} (Code: {pharmacy.tenant_code})")
    return pharmacy


def create_test_user(db: Session, pharmacy_id: int, full_name: str, email: str):
    """Créer un utilisateur rattaché à une pharmacie."""
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"⚠️  L'utilisateur {email} existe déjà")
        return existing
    
    user = User(
        email=email,
        hashed_password=get_password_hash("test123"),
        full_name=full_name,
        pharmacy_id=pharmacy_id,
        is_active=True,
        is_superuser=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    print(f"✅ Utilisateur créé: {user.email}")
    return user

def main():
    """Fonction principale"""
    print("=" * 60)
    print("🚀 INITIALISATION DE LA BASE DE DONNÉES SANTHIUM")
    print("=" * 60)
    print()
    
    # Initialiser la base de données
    init_database()
    print()
    
    # Créer une session
    db = SessionLocal()
    
    try:
        # Créer deux pharmacies de test
        print("Création des pharmacies de test...")
        paris_pharmacy = ensure_pharmacy(
            db,
            name="Pharmacie Paris Centre",
            city="Paris",
            code="PH-PARIS01",
            phone="0102030405",
            email="paris@santhium.fr"
        )
        lyon_pharmacy = ensure_pharmacy(
            db,
            name="Pharmacie Lyon Lumière",
            city="Lyon",
            code="PH-LYON01",
            phone="0607080910",
            email="lyon@santhium.fr"
        )
        print()
        
        # Créer les utilisateurs de test associés
        print("Création des utilisateurs de test...")
        create_test_user(db, paris_pharmacy.id, "Pharmacie Paris", "paris@test.fr")
        create_test_user(db, lyon_pharmacy.id, "Pharmacie Lyon", "lyon@test.fr")
        print()
        
        print("=" * 60)
        print("✅ INITIALISATION TERMINÉE!")
        print("=" * 60)
        print()
        print("🔐 Identifiants de test:")
        print(f"   - Email: paris@test.fr | Code: {paris_pharmacy.tenant_code} | Mot de passe: test123")
        print(f"   - Email: lyon@test.fr  | Code: {lyon_pharmacy.tenant_code} | Mot de passe: test123")
        print()
        print("🌐 Accédez à l'application:")
        print(f"   Frontend: http://localhost:80")
        print(f"   API: http://localhost:8000")
        print(f"   Documentation API: http://localhost:8000/docs")
        print()
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
