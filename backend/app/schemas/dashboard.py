from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import date

class DashboardOverview(BaseModel):
    monthly_orders: int
    monthly_revenue: Optional[Decimal]
    active_customers: int
    low_stock_items: int

    class Config:
        from_attributes = True

class MonthlyMetrics(BaseModel):
    month: date
    total_orders: int
    total_revenue: Decimal
    unique_customers: int

    class Config:
        from_attributes = True

class TopProducts(BaseModel):
    product_id: int
    name: str
    total_sold: int
    total_revenue: Decimal

    class Config:
        from_attributes = True

class TopCustomers(BaseModel):
    customer_id: int
    name: str
    total_orders: int
    total_spent: Decimal

    class Config:
        from_attributes = True