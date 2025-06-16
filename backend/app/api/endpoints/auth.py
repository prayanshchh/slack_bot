from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Any, Optional
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.database.base import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token, UserLogin
from app.core.security import create_access_token
from app.utils.cookie_utils import (
    set_auth_cookie,
    clear_auth_cookie,
    decrypt_cookie_value,
    AUTH_COOKIE_NAME,
    NORMAL_TOKEN_EXPIRE,
    REMEMBER_ME_TOKEN_EXPIRE
)
from app.core.security import get_current_user_from_cookie

router = APIRouter()
settings = get_settings()

@router.post("/register", response_model=UserResponse)
async def register(
    user_in: UserCreate,
    response: Response,
    db: Session = Depends(get_db)
) -> Any:
    """Register a new user and set auth cookie"""
    # Check if user with this email already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=User.get_password_hash(user_in.password),
        last_login=datetime.utcnow()
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create access token and set cookie
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=REMEMBER_ME_TOKEN_EXPIRE if user_in.remember_me else NORMAL_TOKEN_EXPIRE
    )
    set_auth_cookie(
        response=response,
        access_token=access_token,
        remember_me=user_in.remember_me,
    )
    
    return user

@router.post("/login", response_model=UserResponse)
async def login(
    user_in: UserLogin,
    response: Response,
    db: Session = Depends(get_db)
) -> Any:
    """Login user and set auth cookie"""
    # Find user by email
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not user.verify_password(user_in.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )  
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token and set cookie
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=REMEMBER_ME_TOKEN_EXPIRE if user_in.remember_me else NORMAL_TOKEN_EXPIRE
    )
    print(f"Debug: Login - Created access token for user {user.email}")
    
    set_auth_cookie(
        response=response,
        access_token=access_token,
        remember_me=user_in.remember_me,
    )
    
    # Debug: Check response headers after setting cookie
    print(f"Debug: Login - Final response headers: {dict(response.headers)}")
    
    return user

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    request: Request,
    current_user: User = Depends(get_current_user_from_cookie)
) -> Any:
    """Get current user information"""
    # Debug: Log all cookies received
    print(f"Debug: /auth/me - All cookies received: {request.cookies}")
    print(f"Debug: /auth/me - auth_data cookie: {request.cookies.get('auth_data')}")
    print(f"Debug: /auth/me - All request headers: {dict(request.headers)}")
    
    return current_user

@router.post("/logout")
async def logout(response: Response) -> Any:
    """Logout user by clearing the auth cookie"""
    clear_auth_cookie(response)
    return {"message": "Successfully logged out"}