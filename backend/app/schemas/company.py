from pydantic import BaseModel, HttpUrl, EmailStr, Field, validator, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
import re
from .base import CompanyBase

class CompanyCreate(CompanyBase):
    """Schema for creating a new company"""
    pass

class CompanyUpdate(BaseModel):
    """Schema for updating an existing company"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    greyt_hr_username: Optional[str] = Field(None, min_length=3, max_length=50)
    greyt_hr_password: Optional[str] = Field(None, min_length=8)
    access_token: Optional[str] = None
    token_expiry: Optional[datetime] = None
    description: Optional[str] = None

class CompanyInDB(CompanyBase):
    """Company model as stored in database"""
    id: str = Field(..., description="Company UUID")
    access_token: Optional[str] = Field(None, description="GreytHR access token")
    token_expiry: Optional[datetime] = Field(None, description="Token expiry timestamp")
    created_at: datetime = Field(..., description="Record creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")

    model_config = ConfigDict(from_attributes=True)

class CompanyResponse(CompanyInDB):
    """Company model for API responses"""
    greyt_hr_password: Optional[str] = Field(None, exclude=True)  # Exclude from response

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "name": "Acme Corp",
                "greyt_hr_username": "api_user",
                "access_token": "ghr_123...",
                "token_expiry": "2024-03-20T10:00:00Z",
                "created_at": "2024-03-19T10:00:00Z",
                "updated_at": "2024-03-19T10:00:00Z"
            }
        }
    }

class ImportEmployeesResponse(BaseModel):
    """Response schema for employee import"""
    message: str = Field(..., description="Import result message")
    company_name: str = Field(..., description="Name of the company")

    model_config = ConfigDict(from_attributes=True) 