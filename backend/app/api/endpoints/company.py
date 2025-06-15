from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.base import get_db
from app.models.company import Company
from app.models.user import User
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse, ImportEmployeesResponse
from app.utils.sync_employees import GreytHREmployeeSync
from app.core.security import get_current_user_from_cookie

router = APIRouter()

@router.post("/", response_model=CompanyResponse)
async def create_company(
    *,
    db: Session = Depends(get_db),
    company_in: CompanyCreate,
    current_user: User = Depends(get_current_user_from_cookie)
):
    """
    Create a new company with GreytHR credentials.
    """
    # Check if company with same name exists for this user
    company = db.query(Company).filter(
        Company.name == company_in.name,
        Company.user_id == current_user.id
    ).first()
    
    if company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a company with this name"
        )
    
    # Create new company
    company = Company(
        name=company_in.name,
        greyt_hr_username=company_in.greyt_hr_username,
        user_id=current_user.id  # Associate company with current user
    )
    company.set_greyt_hr_password(company_in.greyt_hr_password)
    
    db.add(company)
    db.commit()
    db.refresh(company)
    
    # Get GreytHR token and import employees for the new company
    try:
        # Get token using the new function that accepts company object
        syncer = GreytHREmployeeSync(company)
        await syncer.sync_to_database(db)
    except Exception as e:
        # If employee import fails, delete the company
        db.delete(company)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to import employees: {str(e)}"
        )
    
    return company

@router.put("/{company_name}", response_model=CompanyResponse)
async def update_company(
    *,
    db: Session = Depends(get_db),
    company_name: str,
    company_in: CompanyUpdate,
    current_user: User = Depends(get_current_user_from_cookie)
):
    """
    Update company GreytHR credentials.
    Users can only update their own companies.
    Company is identified by name (which is unique per user).
    """
    company = db.query(Company).filter(
        Company.name == company_name,
        Company.user_id == current_user.id
    ).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found or you don't have permission to update it"
        )
    
    # Check for unique constraints if updating name
    if company_in.name and company_in.name != company.name:
        existing_company = db.query(Company).filter(
            Company.name == company_in.name,
            Company.user_id == current_user.id,
            Company.id != company.id
        ).first()
        
        if existing_company:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You already have another company with this name"
            )
    
    # Update company details
    if company_in.name is not None:
        company.name = company_in.name
    if company_in.greyt_hr_username is not None:
        company.greyt_hr_username = company_in.greyt_hr_username
    if company_in.greyt_hr_password is not None:
        company.set_greyt_hr_password(company_in.greyt_hr_password)
    
    db.add(company)
    db.commit()
    db.refresh(company)
    
    # If GreytHR credentials were updated, reimport employees
    if any([
        company_in.greyt_hr_username is not None,
        company_in.greyt_hr_password is not None
    ]):
        try:
            syncer = GreytHREmployeeSync(company)
            await syncer.sync_to_database(db)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to update employees: {str(e)}"
            )
    
    return company

@router.get("/{company_name}", response_model=CompanyResponse)
def get_company(
    *,
    db: Session = Depends(get_db),
    company_name: str,
    current_user: User = Depends(get_current_user_from_cookie)
):
    """
    Get company details by name.
    Users can only view their own companies.
    Company is identified by name (which is unique per user).
    """
    company = db.query(Company).filter(
        Company.name == company_name,
        Company.user_id == current_user.id
    ).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found or you don't have permission to view it"
        )
    return company

@router.get("/", response_model=List[CompanyResponse])
def list_companies(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user_from_cookie)
):
    """
    List all companies for the current user.
    """
    companies = db.query(Company).filter(
        Company.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return companies

@router.post("/{company_name}/import-employees", response_model=ImportEmployeesResponse)
async def import_employees(
    *,
    db: Session = Depends(get_db),
    company_name: str,
    current_user: User = Depends(get_current_user_from_cookie)
):
    """
    Import employees from GreytHR for a specific company.
    This endpoint will sync employees from GreytHR to our database,
    only importing employees that don't already exist.
    """
    # Get the company
    company = db.query(Company).filter(
        Company.name == company_name,
        Company.user_id == current_user.id
    ).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found or you don't have permission to access it"
        )
    
    try:        
        syncer = GreytHREmployeeSync(company)
        await syncer.sync_to_database(db)
        
        return ImportEmployeesResponse(
            message=f"Successfully imported employees for {company.name}",
            company_name=company.name
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to import employees: {str(e)}"
        )

@router.delete("/{company_name}")
async def delete_company(
    *,
    db: Session = Depends(get_db),
    company_name: str,
    current_user: User = Depends(get_current_user_from_cookie)
):
    """
    Delete a company and all its associated employees.
    Users can only delete their own companies.
    Company is identified by name (which is unique per user).
    """
    company = db.query(Company).filter(
        Company.name == company_name,
        Company.user_id == current_user.id
    ).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found or you don't have permission to delete it"
        )
    
    try:
        # Delete the company (employees will be automatically deleted due to CASCADE)
        db.delete(company)
        db.commit()
        
        return {"message": f"Company '{company_name}' and all its employees have been deleted successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete company: {str(e)}"
        ) 