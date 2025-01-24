from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal

class SupplierBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    contact_info: Optional[str] = Field(None, max_length=500)

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    contact_info: Optional[str] = None

class SupplierResponse(SupplierBase):
    supplier_id: int
    total_orders: Optional[int] = 0
    avg_delivery_days: Optional[float] = 0.0

    class Config:
        from_attributes = True

class SupplierPerformance(BaseModel):
    supplier_id: int
    name: str
    total_orders: int
    avg_delivery_days: float

    class Config:
        from_attributes = True