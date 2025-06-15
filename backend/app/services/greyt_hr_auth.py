import os
import base64
import aiohttp
import asyncio
import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.company import Company
from app.database.base import get_db, init_db
from dotenv import load_dotenv

load_dotenv()

# Configure logging with more detail
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def get_and_store_greythr_token(company: Company, db: Session):    
    """
    Get and store GreytHR token for a specific company.
    
    Args:
        company: Company object containing GreytHR credentials
        db: Database session
    """
    # Extract credentials from company object
    username = company.greyt_hr_username
    password = company.get_greyt_hr_password()  # Decrypt the password

    if not all([username, password]):
        logger.error(f"Missing GreytHR credentials for company: {company.name}")
        raise ValueError(f"Please provide complete GreytHR credentials for company: {company.name}")

    # Create Basic Auth header
    auth_string = f"{username}:{password}"
    auth_bytes = auth_string.encode('ascii')
    base64_auth = base64.b64encode(auth_bytes).decode('ascii')
    
    # Construct GreytHR URL using company name
    # Format: https://{company_name}.greythr.com
    base_url = f"https://{company.name.lower().replace(' ', '').replace('-', '')}.greythr.com"
    auth_url = f"{base_url}/uas/v1/oauth2/client-token"
    
    try:
        logger.info(f"Making token request for company: {company.name}")
        logger.info(f"Auth URL: {auth_url}")
        logger.info(f"Username: {username}")
        logger.info(f"Domain: {base_url}")
        async with aiohttp.ClientSession() as session:
            async with session.post(
                auth_url,
                headers={"Authorization": f"Basic {base64_auth}"}
            ) as response:
                logger.info(f"Response Status: {response.status}")
                logger.debug(f"Response Headers: {dict(response.headers)}")
                
                # Handle redirects (authentication failures)
                if response.status in [301, 302, 303, 307, 308]:
                    location = response.headers.get('Location', '')
                    logger.error(f"Got redirect to: {location}")
                    raise Exception(f"Authentication failed - redirected to login page. Check your credentials and domain.")
                
                if response.status == 401:
                    error_text = await response.text()
                    logger.error(f"Unauthorized - Invalid credentials")
                    logger.error(f"Response body: {error_text}")
                    raise Exception("Authentication failed - Invalid username or password")
                
                if response.status == 403:
                    error_text = await response.text()
                    logger.error(f"Forbidden - Access denied")
                    logger.error(f"Response body: {error_text}")
                    raise Exception("Authentication failed - Access denied. Check your permissions")
                
                if response.status == 404:
                    error_text = await response.text()
                    logger.error(f"Not Found - Invalid domain or endpoint")
                    logger.error(f"Response body: {error_text}")
                    raise Exception("Authentication failed - Invalid domain or endpoint URL")
                
                if response.status == 200:
                    # Check if response is JSON
                    content_type = response.headers.get('content-type', '')
                    if 'application/json' not in content_type:
                        error_text = await response.text()
                        logger.error(f"Expected JSON response but got: {content_type}")
                        logger.error(f"Response body: {error_text[:500]}...")  # Log first 500 chars
                        raise Exception(f"Authentication failed - received HTML instead of JSON. Check your credentials and domain.")
                    
                    data = await response.json()
                    logger.info(f"Token Response Data: {data}")
                    token = data["access_token"]
                    expires_in = data["expires_in"]
                    
                    # Calculate token expiry
                    expiry_time = datetime.utcnow() + timedelta(seconds=expires_in)
                    
                    logger.info("Storing token in database...")
                    
                    try:
                        # Update company with new token
                        company.access_token = token
                        company.token_expiry = expiry_time
                        
                        db.add(company)
                        db.commit()
                        logger.info(f"Token stored successfully for company: {company.name}")
                        
                    except Exception as e:
                        db.rollback()
                        logger.error(f"Database Error: {str(e)}")
                        raise
                        
                else:
                    error_text = await response.text()
                    logger.error(f"Error Response:")
                    logger.error(f"Status code: {response.status}")
                    logger.error(f"Response body: {error_text}")
                    raise Exception(f"Failed to get token. Status: {response.status}, Response: {error_text}")
    
    except Exception as e:
        logger.error(f"Unexpected Error: {str(e)}")
        raise 