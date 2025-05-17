from pydantic import BaseModel, EmailStr, Field, GetCoreSchemaHandler
from typing import Optional, List, Any
from datetime import datetime
from bson import ObjectId
from pydantic_core import core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        _source_type: Any,
        _handler: GetCoreSchemaHandler,
    ) -> core_schema.CoreSchema:
        def validate(value: str) -> ObjectId:
            if not ObjectId.is_valid(value):
                raise ValueError("Invalid ObjectId")
            return ObjectId(value)

        return core_schema.no_info_plain_validator_function(
            function=validate,
            serialization=core_schema.to_string_ser_schema(),
        )

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime
    is_active: bool = True
    
    model_config = {
        "json_encoders": {ObjectId: str},
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

class DocumentBase(BaseModel):
    title: str
    content: str

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    model_config = {
        "json_encoders": {ObjectId: str},
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
