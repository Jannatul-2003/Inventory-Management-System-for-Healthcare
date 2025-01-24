from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from decimal import Decimal

class CustomerBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    contact_info: Optional[str] = Field(None, max_length=500)

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    contact_info: Optional[str] = None

class CustomerResponse(CustomerBase):
    customer_id: int
    total_orders: int = 0
    total_spent: float = 0.0

    class Config:
        from_attributes = True

class CustomerOrderHistory(BaseModel):
    order_id: int
    order_date: date
    product_name: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    class Config:
        from_attributes = True

class CustomerValueAnalysis(BaseModel):
    customer_id: int
    name: str
    total_orders: int
    total_spent: float

    class Config:
        from_attributes = True