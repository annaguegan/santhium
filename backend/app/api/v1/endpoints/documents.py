# backend/app/api/v1/endpoints/documents.py
"""
Routes de gestion des documents
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io

from app.core.dependencies import get_db, get_current_user
from app.schemas.document import DocumentResponse, DocumentList
from app.services.document_service import DocumentService
from app.models.user import User

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    code: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload d'un document par un patient
    
    Accessible sans authentification (utilise le code)
    """
    document_service = DocumentService(db)
    
    try:
        # Lire le contenu du fichier
        content = await file.read()
        
        # Upload et chiffrement
        document = document_service.upload_document(
            code=code,
            filename=file.filename,
            content=content,
            content_type=file.content_type
        )
        
        return document
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de l'upload")


@router.get("", response_model=DocumentList)
async def get_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupérer tous les documents de la pharmacie"""
    document_service = DocumentService(db)
    
    documents = document_service.get_pharmacy_documents(
        pharmacy_id=current_user.pharmacy_id
    )
    
    return {
        "documents": documents,
        "total": len(documents)
    }


@router.get("/{document_id}/download")
async def download_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Télécharger un document (déchiffré)"""
    document_service = DocumentService(db)
    
    try:
        # Récupérer et déchiffrer
        document, decrypted_content = document_service.download_document(
            document_id=document_id,
            pharmacy_id=current_user.pharmacy_id
        )
        
        # Retourner le fichier
        return StreamingResponse(
            io.BytesIO(decrypted_content),
            media_type=document.mime_type,
            headers={
                "Content-Disposition": f"attachment; filename={document.original_filename}"
            }
        )
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Supprimer un document"""
    document_service = DocumentService(db)
    
    try:
        document_service.delete_document(
            document_id=document_id,
            pharmacy_id=current_user.pharmacy_id
        )
        return {"message": "Document supprimé avec succès"}
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))