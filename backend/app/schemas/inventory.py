from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal

class InventoryUpdate(BaseModel):
    quantity: int = Field(..., ge=0)

class InventoryResponse(BaseModel):
    inventory_id: int
    product_id: int
    product_name: str
    price: Decimal
    quantity: int
    status: str

    class Config:
        from_attributes = True

class StockAlert(BaseModel):
    product_id: int
    name: str
    description: Optional[str]
    price: Decimal

    class Config:
        from_attributes = True