from fastapi import APIRouter, HTTPException, Query, Path
from app.schemas.inventory import InventoryUpdate, InventoryResponse, StockAlert
from app.repositories import inventory_repo
from typing import List, Optional

router = APIRouter()

@router.get("/", response_model=List[InventoryResponse])
async def get_inventory(
    low_stock: bool = Query(False, description="Filter for low stock items")
):
    """Get all inventory items or low stock items"""
    if low_stock:
        return await inventory_repo.get_low_stock_items()
    return await inventory_repo.get_all_inventory()

@router.get("/alerts", response_model=List[StockAlert])
async def get_stock_alerts():
    """Get items with critically low stock"""
    return await inventory_repo.get_stock_alerts()

@router.get("/{product_id}", response_model=InventoryResponse)
async def get_product_inventory(
    product_id: int = Path(..., gt=0)
):
    """Get inventory for specific product"""
    inventory = await inventory_repo.get_inventory_by_product(product_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="Product not found in inventory")
    return inventory

@router.put("/{product_id}", response_model=InventoryResponse)
async def update_inventory(
    product_id: int = Path(..., gt=0),
    inventory: InventoryUpdate = None
):
    """Update product inventory quantity"""
    if inventory is None:
        raise HTTPException(status_code=400, detail="Request body is required")
    
    updated = await inventory_repo.update_inventory(product_id, inventory.quantity)
    if not updated:
        raise HTTPException(status_code=400, detail="Failed to update inventory")
    return updated