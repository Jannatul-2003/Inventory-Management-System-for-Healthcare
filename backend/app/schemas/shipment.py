from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class ShipmentDetailBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class ShipmentDetail(ShipmentDetailBase):
    product_name: Optional[str] = None

class ShipmentBase(BaseModel):
    order_id: int
    shipment_date: date

class ShipmentCreate(ShipmentBase):
    details: List[ShipmentDetailBase]

class ShipmentUpdate(BaseModel):
    shipment_date: Optional[date] = None
    details: Optional[List[ShipmentDetailBase]] = None

class ShipmentResponse(ShipmentBase):
    shipment_id: int
    order_date: date
    delivery_days: float
    details: List[ShipmentDetail]

    class Config:
        from_attributes = True

class LateShipment(BaseModel):
    order_id: int
    order_date: date
    shipment_id: Optional[int] = None
    shipment_date: Optional[date] = None
    delivery_days: Optional[float] = None

    class Config:
        from_attributes = True