from pydantic import BaseModel
from typing import Optional
from datetime import date
from decimal import Decimal

class SalesAnalytics(BaseModel):
    sale_date: date
    orders: int
    customers: int
    units_sold: int
    revenue: Decimal
    prev_revenue: Optional[Decimal]
    growth_rate: Optional[float]

    class Config:
        from_attributes = True

class ProductAnalytics(BaseModel):
    product_id: int
    name: str
    order_count: int
    total_units: int
    total_revenue: Decimal
    avg_order_size: float
    current_stock: int
    monthly_velocity: float

    class Config:
        from_attributes = True

class CustomerAnalytics(BaseModel):
    customer_id: int
    name: str
    total_orders: int
    total_spent: Decimal
    first_order: date
    last_order: date
    avg_order_value: Decimal
    customer_lifetime_days: int

    class Config:
        from_attributes = True

class SupplierAnalytics(BaseModel):
    supplier_id: int
    name: str
    total_orders: int
    total_units: int
    total_value: Decimal
    avg_delivery_days: float
    avg_order_value: Decimal
    performance_rating: str

    class Config:
        from_attributes = True

class TrendAnalytics(BaseModel):
    month: date
    orders: int
    customers: int
    units: int
    revenue: Decimal
    unique_products: int
    prev_revenue: Optional[Decimal]
    revenue_growth: Optional[float]
    avg_order_value: Decimal
    avg_units_per_order: float

    class Config:
        from_attributes = True
