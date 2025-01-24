from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from decimal import Decimal

class PaymentBase(BaseModel):
    order_id: int
    payment_date: date
    amount: Decimal = Field(..., gt=0)

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    payment_id: int
    order_date: date
    customer_name: str

    class Config:
        from_attributes = True

class PaymentAnalysis(BaseModel):
    date: str
    period: str
    total_payments: Decimal

    class Config:
        from_attributes = True