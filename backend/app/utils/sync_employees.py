import os
import logging
import aiohttp
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.database.base import SessionLocal, engine
from app.models.employee import Employee
from app.models.company import Company
from app.services.greyt_hr import GreytHRLeaveAPI
from app.core.config import get_settings
from app.services.greyt_hr_auth import get_and_store_greythr_token

# Load environment variables
load_dotenv()

# Get settings
settings = get_settings()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class GreytHREmployeeSync:
    def __init__(self, company: Company):
        self.company = company
        self.id = company.id
        # Get the base URL from config
        self.base_url = settings.GREYT_HR_API_BASE_URL
        # Construct domain for x-greythr-domain header using company name
        # Format: {company_name}.greythr.com
        self.domain = f"{company.name.lower().replace(' ', '').replace('-', '')}.greythr.com"

    async def get_company_token(self, db: Session) -> Optional[str]:
        """Get company's access token from database"""
        if not self.company:
            raise Exception(f"Company object not found")
            
        if not self.company.access_token or self.company.token_expiry and self.company.token_expiry < datetime.utcnow():
            # Use the async function properly
            await get_and_store_greythr_token(self.company, db)
            
        logger.info(f"Using domain: {self.domain}")
            
        return self.company.access_token

    async def get_employees_page(self, db: Session, page: int, size: int = 25) -> Dict[str, Any]:
        """Get a single page of employees from GreytHR"""
        token = await self.get_company_token(db)
        if not token:
            token = await self.get_company_token(db=db)

        if not self.domain:
            raise Exception("Domain not set. Make sure company record exists in database.")

        # Use the correct API endpoint - should use the base URL from config
        employees_url = f"{self.base_url}/employee/v2/employees"
        params = {
            "page": page,
            "size": size
        }
        
        headers = {
            "ACCESS-TOKEN": token,
            "x-greythr-domain": self.domain
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    employees_url,
                    headers=headers,
                    params=params,
                    allow_redirects=False
                ) as response:
                    if response.status == 302:  # Redirect
                        location = response.headers.get('Location', '')
                        logger.error(f"Got redirect to: {location}")
                        raise Exception(f"Authentication failed - redirected to login")
                        
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"Failed to get employees. Status: {response.status}")
                        logger.error(f"Response headers: {dict(response.headers)}")
                        logger.error(f"Response body: {error_text}")
                        
                        if response.status == 403:
                            logger.error("Access forbidden. Please check:")
                            logger.error(f"1. Domain in database: {self.domain}")
                            logger.error(f"2. Token: {token[:10]}...")
                            logger.error("3. Make sure the domain matches your company's GreytHR domain exactly")
                        
                        raise Exception(f"Failed to get employees: {error_text}")
                    
                    return await response.json()
        except aiohttp.ClientError as e:
            logger.error(f"Network error: {str(e)}")
            raise Exception(f"Network error while fetching employees: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise

    async def get_all_employees(self, db: Session) -> List[Dict[str, Any]]:
        """Get all employees from GreytHR using pagination"""
        all_employees = []
        page = 1
        size = 25  # Default page size

        while True:
            try:
                logger.info(f"Fetching page {page} of employees...")
                response = await self.get_employees_page(db, page, size)
                
                employees = response.get("data", [])
                if not employees:
                    break
                
                filtered_employees = [{
                    "employee_id": str(emp["employeeId"]),
                    "name": emp["name"],
                    "email": emp["email"]
                } for emp in employees]
                
                all_employees.extend(filtered_employees)
                
                # If we got fewer records than the page size, we're done
                if len(employees) < size:
                    break
                    
                page += 1
                
            except Exception as e:
                logger.error(f"Error fetching page {page}: {str(e)}")
                break

        return all_employees

    async def sync_to_database(self, db: Session) -> None:
        """Sync employees from GreytHR to our database"""
        try:
            # Get all employees from GreytHR
            employees = await self.get_all_employees(db)
            logger.info(f"Found {len(employees)} employees in GreytHR")
            
            # Track statistics
            created = 0
            updated = 0
            skipped = 0
            
            for emp_data in employees:
                # Check if employee exists for this company by employee_id (primary check)
                existing_by_id = db.query(Employee).filter_by(
                    employee_id=emp_data["employee_id"],
                    company_id=self.company.id
                ).first()
                
                if existing_by_id:
                    # Employee already exists with this employee_id, skip
                    logger.debug(f"Skipping employee {emp_data['name']} - already exists with employee_id {emp_data['employee_id']}")
                    skipped += 1
                    continue
                
                else:
                    # Create new employee
                    employee = Employee(
                        employee_id=emp_data["employee_id"],
                        name=emp_data["name"],
                        email=emp_data["email"],
                        company_id=self.company.id
                    )
                    db.add(employee)
                    created += 1
                    logger.info(f"Created new employee {emp_data['name']} with employee_id {emp_data['employee_id']}")
            
            db.commit()
            logger.info(f"Sync completed for {self.company.name}: {created} created, {updated} updated, {skipped} skipped")
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error syncing employees: {str(e)}")
            raise

    async def delete_company_employees(self, db: Session) -> None:
        """Delete all employees for this company from the database"""
        try:
            # Delete all employees for this company
            deleted = db.query(Employee).filter_by(company_id=self.company.id).delete()
            db.commit()
            logger.info(f"Deleted {deleted} employees for company {self.company.name}")
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting employees: {str(e)}")
            raise