from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, Cookie, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.database.base import get_db
from app.models.user import User
from app.utils.cookie_utils import decrypt_cookie_value, AUTH_COOKIE_NAME

settings = get_settings()
ACCESS_TOKEN_COOKIE_NAME = "access_token"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_token_from_cookie(
    request: Request,
    access_token: Optional[str] = Cookie(None, alias=ACCESS_TOKEN_COOKIE_NAME)
) -> Optional[str]:
    """Get token from cookie or Authorization header"""
    # First try to get from cookie
    if access_token:
        return access_token
    
    # Fallback to Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    
    return None

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

async def get_current_user_from_cookie(
    auth_data: Optional[str] = Cookie(None, alias=AUTH_COOKIE_NAME),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to get current user from cookie"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not auth_data:
        raise credentials_exception
        
    try:
        # Decrypt the cookie value to get the access token
        cookie_data = decrypt_cookie_value(auth_data)
        
        token = cookie_data.get("access_token")
        if not token:
            print("Debug: No access token in cookie data")  # Debug log
            raise credentials_exception
            
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
    except (JWTError, ValueError) as e:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
        
    return user 