# backend/app/api/v1/endpoints/codes.py
"""
Routes de gestion des codes/QR codes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.schemas.code import CodeCreate, CodeResponse
from app.services.code_service import CodeService
from app.models.user import User

router = APIRouter(prefix="/codes", tags=["codes"])


@router.post("/generate", response_model=CodeResponse)
async def generate_code(
    code_data: CodeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Générer un nouveau code de transfert
    
    Nécessite authentification (pharmacien)
    """
    code_service = CodeService(db)
    
    code = code_service.create_code(
        user_id=current_user.id,
        pharmacy_id=current_user.pharmacy_id,
        expiration_hours=code_data.expiration_hours
    )
    
    return code


@router.post("/validate")
async def validate_code(
    code: str,
    db: Session = Depends(get_db)
):
    """
    Valider un code avant upload
    
    Accessible sans authentification (patient)
    """
    code_service = CodeService(db)
    
    is_valid = code_service.validate_code(code)
    
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Code invalide ou expiré"
        )
    
    return {"valid": True, "message": "Code valide"}


@router.get("/active", response_model=list[CodeResponse])
async def get_active_codes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupérer tous les codes actifs du pharmacien"""
    code_service = CodeService(db)
    
    codes = code_service.get_active_codes(
        pharmacy_id=current_user.pharmacy_id
    )
    
    return codes