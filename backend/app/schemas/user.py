from pydantic import BaseModel, EmailStr, Field, constr, ConfigDict
from typing import Optional
from datetime import datetime
from .base import UserBase

class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: constr(min_length=8) = Field(..., description="User's password (min 8 characters)")
    remember_me: bool = Field(False, description="Whether to remember the user for 30 days")

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")
    remember_me: bool = Field(False, description="Whether to remember the user for 30 days")

class UserUpdate(BaseModel):
    """Schema for updating user information"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    password: Optional[constr(min_length=8)] = Field(None, description="New password (min 8 characters)")

class UserInDB(UserBase):
    """User model as stored in database"""
    id: str = Field(..., description="User UUID")
    created_at: datetime = Field(..., description="Record creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")
    last_login: Optional[datetime] = Field(None, description="Last login timestamp")

    model_config = ConfigDict(from_attributes=True)

class UserResponse(UserInDB):
    """User model for API responses"""
    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "admin@company.com",
                "name": "John Admin",
                "is_active": True,
                "created_at": "2024-03-19T10:00:00Z",
                "updated_at": "2024-03-19T10:00:00Z",
                "last_login": "2024-03-19T10:00:00Z"
            }
        }
    }

class Token(BaseModel):
    """Schema for access token"""
    access_token: str
    token_type: str = "bearer"
    remember_me: bool = False

class TokenData(BaseModel):
    """Schema for token data"""
    user_id: Optional[str] = None
    remember_me: bool = False 