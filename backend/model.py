from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class User(BaseModel):
    id: Optional[str]
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    hashed_password: str
    settings: Optional[dict] = {}
    created_at: datetime = None
    is_active: bool = True

    def to_dict(self):
        return {
            "email": self.email,
            "username": self.username,
            "hashed_password": self.hashed_password,
            "created_at": self.created_at,
            "is_active": self.is_active
        }

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            email=data["email"],
            username=data["username"],
            hashed_password=data["hashed_password"],
            created_at=data.get("created_at"),
            is_active=data.get("is_active", True)
        )

class Document(BaseModel):
    id: Optional[str]
    owner_id: str
    title: str
    content: str
    created_at: datetime = None
    updated_at: datetime = None

    def to_dict(self):
        return {
            "title": self.title,
            "content": self.content,
            "user_id": self.owner_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            title=data["title"],
            content=data["content"],
            owner_id=data["user_id"],
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at")
        )
