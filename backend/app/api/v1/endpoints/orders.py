# File: app/api/v1/endpoints/orders.py
from fastapi import APIRouter, HTTPException, Query, Path
from app.schemas.order import (
    OrderCreate, 
    OrderUpdate, 
    OrderResponse, 
    OrderSummary,
    OrderStatusSummary,
    OrderDetail
)
from app.repositories import order_repo
from typing import List, Optional
from datetime import date

router = APIRouter()

@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    start_date: Optional[date] = Query(None, description="Filter orders from this date"),
    end_date: Optional[date] = Query(None, description="Filter orders until this date"),
    customer_id: Optional[int] = Query(None, description="Filter orders by customer ID"),
    supplier_id: Optional[int] = Query(None, description="Filter orders by supplier ID")
):
    """Get all orders with optional date range and customer/supplier filters"""
    return await order_repo.get_orders(start_date, end_date, customer_id, supplier_id)

@router.get("/summary", response_model=List[OrderSummary])
async def get_order_summary():
    """Get summary view of all orders with customer and supplier details"""
    return await order_repo.get_order_summary()

@router.get("/status", response_model=List[OrderStatusSummary])
async def get_order_status():
    """Get status summary of all orders including payment and shipment status"""
    return await order_repo.get_order_status()

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int = Path(..., gt=0)
):
    """Get a specific order by ID"""
    order = await order_repo.get_order_by_id(order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/{order_id}/details", response_model=List[OrderDetail])
async def get_order_details(
    order_id: int = Path(..., gt=0)
):
    """Get details of a specific order"""
    order = await order_repo.get_order_by_id(order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return await order_repo.get_order_details(order_id)

@router.post("/", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    """Create a new order"""
    return await order_repo.create_order(order)

@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int = Path(..., gt=0),
    order: OrderUpdate = None
):
    """Update an order"""
    if order is None:
        raise HTTPException(status_code=400, detail="Request body is required")
        
    existing_order = await order_repo.get_order_by_id(order_id)
    if not existing_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    updated_order = await order_repo.update_order(order_id, order)
    if not updated_order:
        raise HTTPException(status_code=400, detail="Failed to update order")
    return updated_order

@router.delete("/{order_id}")
async def delete_order(
    order_id: int = Path(..., gt=0)
):
    """Delete an order if it hasn't been shipped"""
    existing_order = await order_repo.get_order_by_id(order_id)
    if not existing_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if await order_repo.check_order_shipped(order_id):
        raise HTTPException(status_code=400, detail="Cannot delete shipped order")
    
    deleted = await order_repo.delete_order(order_id)
    if not deleted:
        raise HTTPException(status_code=400, detail="Failed to delete order")
    return {"message": "Order deleted successfully"}


