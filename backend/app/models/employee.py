from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base
import uuid

class Employee(Base):
    """Employee model for storing employee information from GreytHR"""
    __tablename__ = "employees"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = Column(Integer, nullable=False, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    
    # Company relationship
    company_id = Column(String(36), ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    company = relationship("Company", back_populates="employees")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Employee(employee_id='{self.employee_id}', name='{self.name}', email='{self.email}')>" 