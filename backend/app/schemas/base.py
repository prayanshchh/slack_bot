from pydantic import BaseModel, HttpUrl, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
import re

class CompanyBase(BaseModel):
    """Base company model without relationships"""
    name: str = Field(..., min_length=2, max_length=100, description="Company name")
    greyt_hr_username: str = Field(..., min_length=3, max_length=50, description="GreytHR API username")
    greyt_hr_password: str = Field(..., min_length=8, description="GreytHR API password")
    description: Optional[str] = None

class EmployeeBase(BaseModel):
    """Base employee model without relationships"""
    email: str
    employee_id: str
    name: str

class UserBase(BaseModel):
    """Base user model without relationships"""
    email: EmailStr = Field(..., description="User's email address")
    name: str = Field(..., min_length=2, max_length=100, description="User's full name")
