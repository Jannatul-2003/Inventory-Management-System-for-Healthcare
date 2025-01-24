from fastapi import APIRouter, HTTPException, Query, Path
from app.schemas.shipment import ShipmentCreate, ShipmentUpdate, ShipmentResponse, ShipmentDetail, LateShipment
from app.repositories import shipment_repo
from typing import List, Optional
from datetime import date

router = APIRouter()

@router.get("/", response_model=List[ShipmentResponse])
async def get_shipments(
    late_only: bool = Query(False, description="Filter for late shipments only")
):
    """Get all shipments or late shipments if late_only is True"""
    if late_only:
        return await shipment_repo.get_late_shipments()
    return await shipment_repo.get_all_shipments()

@router.get("/late", response_model=List[LateShipment])
async def get_late_shipments():
    """Get all late shipments (over 7 days or unshipped)"""
    return await shipment_repo.get_late_shipments()

@router.get("/{shipment_id}", response_model=ShipmentResponse)
async def get_shipment(
    shipment_id: int = Path(..., gt=0)
):
    """Get a specific shipment by ID"""
    shipment = await shipment_repo.get_shipment_by_id(shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

@router.post("/", response_model=ShipmentResponse)
async def create_shipment(shipment: ShipmentCreate):
    """Create a new shipment"""
    return await shipment_repo.create_shipment(shipment)

@router.put("/{shipment_id}", response_model=ShipmentResponse)
async def update_shipment(
    shipment_id: int = Path(..., gt=0),
    shipment: ShipmentUpdate = None
):
    """Update a shipment"""
    if shipment is None:
        raise HTTPException(status_code=400, detail="Request body is required")
        
    existing_shipment = await shipment_repo.get_shipment_by_id(shipment_id)
    if not existing_shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    updated_shipment = await shipment_repo.update_shipment(shipment_id, shipment)
    if not updated_shipment:
        raise HTTPException(status_code=400, detail="Failed to update shipment")
    return updated_shipment

@router.delete("/{shipment_id}")
async def delete_shipment(
    shipment_id: int = Path(..., gt=0)
):
    """Delete a shipment"""
    existing_shipment = await shipment_repo.get_shipment_by_id(shipment_id)
    if not existing_shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    deleted = await shipment_repo.delete_shipment(shipment_id)
    if not deleted:
        raise HTTPException(status_code=400, detail="Failed to delete shipment")
    return {"message": "Shipment deleted successfully"}
