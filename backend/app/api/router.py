from fastapi import APIRouter
from app.api.v1.endpoints import auth, pharmacies, codes, documents, health

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(pharmacies.router)
api_router.include_router(codes.router)
api_router.include_router(documents.router)
api_router.include_router(health.router)
