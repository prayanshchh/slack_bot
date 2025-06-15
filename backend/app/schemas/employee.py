from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from .base import EmployeeBase

class EmployeeCreate(EmployeeBase):
    """Model for creating a new employee"""
    company_id: str

class EmployeeUpdate(BaseModel):
    """Model for updating an employee"""
    email: Optional[str] = None
    employee_id: Optional[str] = None
    name: Optional[str] = None
    company_id: Optional[str] = None

class EmployeeInDB(EmployeeBase):
    """Employee model as stored in database"""
    id: str
    company_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class EmployeeResponse(EmployeeInDB):
    """Employee model for API responses"""
    pass
