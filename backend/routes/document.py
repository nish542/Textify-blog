from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from schemas import Document, DocumentCreate
from auth import get_current_user
from database import db

router = APIRouter()

@router.post("/documents", response_model=Document)
async def create_document(
    document: DocumentCreate,
    current_user = Depends(get_current_user)
):
    document_dict = document.dict()
    document_dict["user_id"] = current_user.id
    document_dict["created_at"] = datetime.utcnow()
    document_dict["updated_at"] = datetime.utcnow()
    
    result = await db.documents.insert_one(document_dict)
    created_document = await db.documents.find_one({"_id": result.inserted_id})
    return Document(**created_document)

@router.get("/documents", response_model=List[Document])
async def get_user_documents(current_user = Depends(get_current_user)):
    documents = await db.documents.find({"user_id": current_user.id}).to_list(length=100)
    return [Document(**doc) for doc in documents]

@router.get("/documents/{document_id}", response_model=Document)
async def get_document(
    document_id: str,
    current_user = Depends(get_current_user)
):
    document = await db.documents.find_one({
        "_id": ObjectId(document_id),
        "user_id": current_user.id
    })
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    return Document(**document)

@router.put("/documents/{document_id}", response_model=Document)
async def update_document(
    document_id: str,
    document: DocumentCreate,
    current_user = Depends(get_current_user)
):
    # Check if document exists and belongs to user
    existing_doc = await db.documents.find_one({
        "_id": ObjectId(document_id),
        "user_id": current_user.id
    })
    if not existing_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Update document
    update_data = document.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    await db.documents.update_one(
        {"_id": ObjectId(document_id)},
        {"$set": update_data}
    )
    
    updated_document = await db.documents.find_one({"_id": ObjectId(document_id)})
    return Document(**updated_document)

@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: str,
    current_user = Depends(get_current_user)
):
    result = await db.documents.delete_one({
        "_id": ObjectId(document_id),
        "user_id": current_user.id
    })
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
