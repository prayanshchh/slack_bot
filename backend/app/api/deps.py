from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.core.config import get_settings
from app.models.user import User
from app.schemas.token import TokenPayload

settings = get_settings()

jwt_auth = HTTPBearer(
    scheme_name="JWT",
    description="JWT token authentication using email/password login"
)

def get_current_user(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(jwt_auth)
) -> User:
    """
    Get current user from JWT token.
    Token is obtained from email/password login.
    """
    try:
        # Extract token from Bearer header
        token = credentials.credentials
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user