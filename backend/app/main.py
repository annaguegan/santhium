# backend/app/main.py
"""
Point d'entrée de l'application Santhium
Initialise FastAPI, les routes, middlewares et la base de données
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.router import api_router
from app.db.session import engine
from app.models import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie de l'application"""
    # Startup: Créer les tables
    Base.metadata.create_all(bind=engine)
    print("✅ Base de données initialisée")
    yield
    # Shutdown: Nettoyage si nécessaire
    print("👋 Arrêt de l'application")


app = FastAPI(
    title="Santhium API",
    description="API sécurisée pour le transfert de documents médicaux",
    version="1.0.0",
    lifespan=lifespan,
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Route racine"""
    return {
        "message": "Bienvenue sur l'API Santhium",
        "version": "1.0.0",
        "documentation": "/docs"
    }


@app.get("/health")
async def health_check():
    """Healthcheck pour Docker"""
    return {"status": "healthy", "service": "santhium-api"}