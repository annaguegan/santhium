"""Endpoints de healthcheck."""

from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", summary="Health check")
async def health_status():
    """Retourne l'état de santé du service."""
    return {"status": "healthy", "service": "santhium-api"}
