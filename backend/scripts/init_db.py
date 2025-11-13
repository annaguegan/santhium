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
from app.core.security import get_password_hash

def init_database():
    """Initialiser la base de données et créer les tables"""
    print("🔧 Création des tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables créées avec succès!")

def create_test_pharmacy(db: Session):
    """Créer une pharmacie de test"""
    # Vérifier si la pharmacie existe déjà
    existing = db.query(Pharmacy).filter(Pharmacy.name == "Pharmacie de Test").first()
    if existing:
        print("⚠️  La pharmacie de test existe déjà")
        return existing
    
    pharmacy = Pharmacy(
        name="Pharmacie de Test",
        address="123 Rue de la Santé",
        city="Paris",
        postal_code="75001",
        phone="0123456789"
    )
    db.add(pharmacy)
    db.commit()
    db.refresh(pharmacy)
    print(f"✅ Pharmacie créée: {pharmacy.name} (ID: {pharmacy.id})")
    return pharmacy

def create_test_user(db: Session, pharmacy_id: int):
    """Créer un utilisateur de test"""
    email = "pharmacie@test.fr"
    
    # Vérifier si l'utilisateur existe déjà
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"⚠️  L'utilisateur {email} existe déjà")
        return existing
    
    user = User(
        email=email,
        hashed_password=get_password_hash("test123"),
        full_name="Pharmacie Test",
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
        # Créer une pharmacie de test
        pharmacy = create_test_pharmacy(db)
        print()
        
        # Créer un utilisateur de test
        user = create_test_user(db, pharmacy.id)
        print()
        
        print("=" * 60)
        print("✅ INITIALISATION TERMINÉE!")
        print("=" * 60)
        print()
        print("🔐 Identifiants de test:")
        print(f"   Email: pharmacie@test.fr")
        print(f"   Mot de passe: test123")
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