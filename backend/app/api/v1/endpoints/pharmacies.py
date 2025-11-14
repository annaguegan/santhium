"""Routes pour la gestion des pharmacies."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.schemas.pharmacy import PharmacyCreate, PharmacyResponse
from app.services.pharmacy_service import PharmacyService

router = APIRouter(prefix="/pharmacies", tags=["pharmacies"])


@router.post("", response_model=PharmacyResponse, status_code=status.HTTP_201_CREATED)
def create_pharmacy(
    pharmacy_data: PharmacyCreate,
    db: Session = Depends(get_db),
):
    """Créer un nouveau tenant pharmacie (accessible sans authentification)."""
    service = PharmacyService(db)
    try:
        return service.create_pharmacy(pharmacy_data)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
