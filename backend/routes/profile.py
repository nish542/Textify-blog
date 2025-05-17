from fastapi import APIRouter, Depends, HTTPException, status
from schemas import User
from auth import get_current_user
from database import db
from datetime import datetime

router = APIRouter()

@router.get("/profile", response_model=User)
async def get_profile(current_user = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=User)
async def update_profile(
    user_update: dict,
    current_user = Depends(get_current_user)
):
    # Remove sensitive fields from update
    if "password" in user_update:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password cannot be updated through this endpoint"
        )
    if "email" in user_update:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email cannot be updated through this endpoint"
        )
    
    # Update user profile
    update_data = {
        k: v for k, v in user_update.items()
        if k not in ["id", "created_at", "is_active", "hashed_password"]
    }
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid fields to update"
        )
    
    result = await db.users.update_one(
        {"_id": current_user.id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No changes were made"
        )
    
    updated_user = await db.users.find_one({"_id": current_user.id})
    return User(**updated_user)

@router.delete("/profile", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(current_user = Depends(get_current_user)):
    # Delete user's documents first
    await db.documents.delete_many({"user_id": current_user.id})
    
    # Delete user
    result = await db.users.delete_one({"_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
