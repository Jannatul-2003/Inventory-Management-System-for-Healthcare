from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
from decimal import Decimal

class OrderDetailBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class OrderDetail(OrderDetailBase):
    order_detail_id: int
    product_name: str
    unit_price: Decimal
    total_price: Decimal

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    order_date: date
    supplier_id: int
    customer_id: int
    details: List[OrderDetailBase]

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    order_date: Optional[date] = None
    supplier_id: Optional[int] = None
    details: Optional[List[OrderDetailBase]] = None

class OrderResponse(BaseModel):
    order_id: int
    order_date: date
    supplier_id: int
    supplier_name: str
    customer_id: int
    customer_name: str
    total_items: int
    total_quantity: int
    total_amount: Decimal
    amount_paid: Decimal
    status: str

    class Config:
        from_attributes = True

class OrderSummary(BaseModel):
    order_id: int
    order_date: date
    supplier_name: str
    customer_name: str
    total_amount: Decimal

    class Config:
        from_attributes = True

class OrderStatusSummary(BaseModel):
    order_id: int
    total_items: int
    total_quantity: int
    total_amount: Decimal
    amount_paid: Decimal
    status: str

    class Config:
        from_attributes = True