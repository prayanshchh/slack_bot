from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base
from cryptography.fernet import Fernet
import os
import uuid

class Company(Base):
    """Company model for storing company information and GreytHR credentials"""
    __tablename__ = "companies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    
    # GreytHR credentials
    greyt_hr_username = Column(String, nullable=False)
    greyt_hr_password = Column(String, nullable=False)
    
    # Access token for API
    access_token = Column(String, nullable=True)
    token_expiry = Column(DateTime, nullable=True)
    
    # User relationship
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    user = relationship("User", back_populates="companies")
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    employees = relationship("Employee", back_populates="company", cascade="all, delete-orphan")

    # Unique constraint for company name per user
    __table_args__ = (
        UniqueConstraint('name', 'user_id', name='uix_company_name_user'),
    )

    def set_greyt_hr_password(self, password: str):
        """Encrypt and store the GreytHR password"""
        key = os.getenv("ENCRYPTION_KEY").encode()
        f = Fernet(key)
        encrypted_password = f.encrypt(password.encode())
        self.greyt_hr_password = encrypted_password.decode()

    def get_greyt_hr_password(self) -> str:
        """Decrypt and return the GreytHR password"""
        if not self.greyt_hr_password:
            return None
        key = os.getenv("ENCRYPTION_KEY").encode()
        f = Fernet(key)
        decrypted_password = f.decrypt(self.greyt_hr_password.encode())
        return decrypted_password.decode()

    def __repr__(self):
        return f"<Company(name='{self.name}')>" 