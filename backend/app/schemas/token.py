from typing import Optional
from pydantic import BaseModel

class Token(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    """Token payload model for JWT"""
    sub: Optional[str] = None  # subject (user id)
    exp: Optional[int] = None  # expiration time
    company_id: Optional[int] = None  # company id for company-specific tokens 