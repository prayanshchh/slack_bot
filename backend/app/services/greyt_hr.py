import os
import logging
import aiohttp
from typing import Dict, Any, Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.models.company import Company
from app.database.base import get_db
from app.core.config import get_settings

# Get settings
settings = get_settings()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GreytHRLeaveAPI:
    def __init__(self):
        self.company: Optional[Company] = None
        self.base_url = settings.GREYT_HR_API_BASE_URL
        self.domain = None

    def get_company_token(self, db: Session, employee: Employee) -> Optional[str]:
        """Get company's access token from database using employee's company"""
        # Explicitly query the company from database
        print("i am employee", employee.company_id)
        company = db.query(Company).filter_by(id=employee.company_id).first()
        
        if not company:
            raise Exception(f"Company not found for employee {employee.email}")
            
        self.company = company
            
        if not self.company.access_token:
            raise Exception(f"No access token found for company {self.company.name}")
            
        # Check if token is expired
        if self.company.token_expiry and self.company.token_expiry < datetime.utcnow():
            raise Exception(f"Access token for company {self.company.name} has expired")
            
        # Construct domain for x-greythr-domain header using company name
        # Format: {company_name}.greythr.com
        self.domain = f"{company.name.lower().replace(' ', '').replace('-', '')}.greythr.com"
        logger.info(f"Using domain: {self.domain}")
            
        return self.company.access_token

    async def get_leave_balance(self, db: Session, employee: Employee, year: int = None) -> Dict[str, Any]:
        """Get employee's leave balance for a given year"""
        token = self.get_company_token(db, employee)
        if not token:
            raise Exception("No valid access token available")

        if not self.domain:
            raise Exception("Domain not set. Make sure company record exists in database.")

        # Use current year if not specified
        if year is None:
            year = datetime.now().year

        url = f"{self.base_url}/leave/v2/employee/{employee.employee_id}/years/{year}/balance"
        print("I AM URL: ", url)
        
        headers = {
            "ACCESS-TOKEN": token,
            "x-greythr-domain": self.domain
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"Failed to get leave balance. Status: {response.status}")
                        logger.error(f"Response: {error_text}")
                        raise Exception(f"Failed to get leave balance: {error_text}")

                    print("I AM leave RESPONSE: ", await response.json())
                    return await response.json()
        except aiohttp.ClientError as e:
            raise Exception(f"Network error while fetching leave balance: {str(e)}")

    async def get_leave_transactions(
        self, 
        db: Session, 
        employee: Employee,
        start_date: str, 
        end_date: str
    ) -> Dict[str, Any]:
        """Get employee's leave transactions for a given date range"""
        token = self.get_company_token(db, employee)
        if not token:
            raise Exception("No valid access token available")

        if not self.domain:
            raise Exception("Domain not set. Make sure company record exists in database.")

        url = f"{self.base_url}/leave/v2/employee/{employee.employee_id}/transactions"
        params = {
            "start": start_date,
            "end": end_date
        }
        
        headers = {
            "ACCESS-TOKEN": token,
            "x-greythr-domain": self.domain
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, params=params) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"Failed to get leave transactions. Status: {response.status}")
                        logger.error(f"Response: {error_text}")
                        raise Exception(f"Failed to get leave transactions: {error_text}")
                    
                    return await response.json()
        except aiohttp.ClientError as e:
            logger.error(f"Network error: {str(e)}")
            raise Exception(f"Network error while fetching leave transactions: {str(e)}")

    def format_leave_balance(self, balance_data: Dict[str, Any]) -> str:
        """Format leave balance data into a readable message"""
        if not balance_data.get("list"):
            return "No leave balance data available."

        message = "*Leave Balance Summary*\n\n"
        
        for leave in balance_data["list"]:
            leave_type = leave["leaveTypeCategory"]["description"]
            balance = leave["balance"]
            granted = leave["grant"]
            availed = leave["availed"]
            
            message += f"*{leave_type}*\n"
            message += f"• Balance: {balance} days\n"
            message += f"• Granted: {granted} days\n"
            message += f"• Availed: {availed} days\n\n"
            
        return message

    def format_leave_transactions(self, transactions_data: Dict[str, Any]) -> str:
        """Format leave transactions data into a readable message"""
        if not transactions_data.get("list"):
            return "No leave transactions found for the specified period."

        message = "*Recent Leave Transactions*\n\n"
        
        for transaction in transactions_data["list"]:
            leave_type = transaction["leaveTypeCategory"]["description"]
            from_date = transaction["fromDate"]
            to_date = transaction["toDate"]
            days = abs(transaction["days"])  # Convert to positive number
            transaction_type = transaction["leaveTransactionType"]["description"]
            
            message += f"*{leave_type}*\n"
            message += f"• Type: {transaction_type}\n"
            message += f"• Period: {from_date} to {to_date}\n"
            message += f"• Days: {days}\n"
            if transaction.get("reason"):
                message += f"• Reason: {transaction['reason']}\n"
            message += "\n"
            
        return message 