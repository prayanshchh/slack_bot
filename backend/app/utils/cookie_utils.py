from fastapi import Response
from sqlalchemy.orm import Session
from typing import Dict, Optional
from cryptography.fernet import Fernet
import os
import json
from datetime import timedelta

from app.core.config import get_settings
from app.models.company import Company

settings = get_settings()

# Cookie settings
AUTH_COOKIE_NAME = "auth_data"
COOKIE_DOMAIN = settings.COOKIE_DOMAIN
COOKIE_SECURE = settings.COOKIE_SECURE
COOKIE_HTTPONLY = settings.COOKIE_HTTPONLY
COOKIE_SAMESITE = settings.COOKIE_SAMESITE

# Token expiration times
NORMAL_TOKEN_EXPIRE = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
REMEMBER_ME_TOKEN_EXPIRE = timedelta(days=30)  # 30 days for remember me

def encrypt_cookie_value(data: Dict) -> str:
    """Encrypt data for cookie storage"""
    key = os.getenv("ENCRYPTION_KEY").encode()
    f = Fernet(key)
    json_data = json.dumps(data)
    return f.encrypt(json_data.encode()).decode()

def decrypt_cookie_value(encrypted_value: str) -> Dict:
    """Decrypt data from cookie storage"""
    key = os.getenv("ENCRYPTION_KEY").encode()
    f = Fernet(key)
    decrypted_data = f.decrypt(encrypted_value.encode()).decode()
    return json.loads(decrypted_data)

def get_company_credentials(db: Session, company_id: int) -> Optional[Dict]:
    """Get company's GreytHR credentials from database"""
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        return None
        
    return {
        "username": company.greyt_hr_username,
        "password": company.get_greyt_hr_password()
    }

def set_auth_cookie(
    response: Response,
    access_token: str,
    remember_me: bool = False,
) -> None:
    """Set a single cookie containing all auth and GreytHR data"""
    # Prepare cookie data
    cookie_data = {
        "access_token": access_token,
        "remember_me": remember_me
    }
        
    encrypted_data = encrypt_cookie_value(cookie_data)
    max_age = REMEMBER_ME_TOKEN_EXPIRE.total_seconds() if remember_me else NORMAL_TOKEN_EXPIRE.total_seconds()
    
    # For development, use "lax" instead of "none" when not secure
    samesite_value = COOKIE_SAMESITE
    if COOKIE_SAMESITE == "none" and not COOKIE_SECURE:
        samesite_value = "lax"
    
    print(f"Debug: Setting cookie with domain='{COOKIE_DOMAIN}', path='/', secure={COOKIE_SECURE}, httponly={COOKIE_HTTPONLY}, samesite='{samesite_value}'")
    
    # Try setting cookie without domain first
    cookie_kwargs = {
        "key": AUTH_COOKIE_NAME,
        "value": encrypted_data,
        "httponly": COOKIE_HTTPONLY,
        "secure": COOKIE_SECURE,
        "samesite": samesite_value,
        "max_age": int(max_age),
        "path": "/"
    }
    
    # Only add domain if it's specified and not None (for production)
    if COOKIE_DOMAIN:
        cookie_kwargs["domain"] = COOKIE_DOMAIN
    
    response.set_cookie(**cookie_kwargs)

    print(f"Debug: Response headers after setting cookie: {dict(response.headers)}")
    
    set_cookie_headers = [header for header in response.headers.getlist("set-cookie")]
    print(f"Debug: Set-Cookie headers: {set_cookie_headers}")
    
    # Also try setting a test cookie to see if cookies work at all
    response.set_cookie(
        key="test_cookie",
        value="test_value",
        path="/",
        max_age=3600
    )
    print(f"Debug: Test cookie headers: {[header for header in response.headers.getlist('set-cookie') if 'test_cookie' in header]}")

def clear_auth_cookie(response: Response) -> None:
    """Clear the auth cookie"""
    response.delete_cookie(
        key=AUTH_COOKIE_NAME,
        domain=COOKIE_DOMAIN,
        path="/",
        secure=COOKIE_SECURE,
        httponly=COOKIE_HTTPONLY,
        samesite=COOKIE_SAMESITE
    ) 