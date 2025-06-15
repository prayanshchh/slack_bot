from sqlalchemy import Column, String, DateTime, ForeignKey, Table, func
from app.database.base import Base

# Association table for many-to-many relationship between User and Company
user_companies = Table(
    'user_companies',
    Base.metadata,
    Column('user_id', String(36), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('company_id', String(36), ForeignKey('companies.id', ondelete='CASCADE'), primary_key=True),
    Column('created_at', DateTime(timezone=True), server_default=func.now()),
    Column('updated_at', DateTime(timezone=True), onupdate=func.now())
)