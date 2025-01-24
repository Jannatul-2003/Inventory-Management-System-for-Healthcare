from fastapi import APIRouter, HTTPException, Query, Path
from app.schemas.supplier import SupplierCreate, SupplierUpdate, SupplierResponse, SupplierPerformance
from app.repositories import supplier_repo
from typing import List, Optional

router = APIRouter()

@router.get("/", response_model=List[SupplierResponse])
async def get_suppliers(
    search: Optional[str] = Query(None, description="Search term for supplier name")
):
    """Get all suppliers or search suppliers if search term is provided"""
    if search:
        return await supplier_repo.search_suppliers(search)
    return await supplier_repo.get_all_suppliers()

@router.get("/performance", response_model=List[SupplierPerformance])
async def get_supplier_performance():
    """Get supplier performance metrics"""
    return await supplier_repo.get_supplier_performance()

@router.get("/{supplier_id}", response_model=SupplierResponse)
async def get_supplier(
    supplier_id: int = Path(..., gt=0, description="The ID of the supplier to get")
):
    """Get a specific supplier by ID"""
    supplier = await supplier_repo.get_supplier_by_id(supplier_id)
    if supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@router.post("/", response_model=SupplierResponse)
async def create_supplier(supplier: SupplierCreate):
    """Create a new supplier"""
    return await supplier_repo.create_supplier(supplier)

@router.put("/{supplier_id}", response_model=SupplierResponse)
async def update_supplier(
    supplier_id: int = Path(..., gt=0),
    supplier: SupplierUpdate= None
):
    """Update a supplier"""
    existing_supplier = await supplier_repo.get_supplier_by_id(supplier_id)
    if not existing_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    updated_supplier = await supplier_repo.update_supplier(supplier_id, supplier)
    if not updated_supplier:
        raise HTTPException(status_code=400, detail="Failed to update supplier")
    return updated_supplier

@router.delete("/{supplier_id}")
async def delete_supplier(
    supplier_id: int = Path(..., gt=0)
):
    """Delete a supplier"""
    existing_supplier = await supplier_repo.get_supplier_by_id(supplier_id)
    if not existing_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    deleted = await supplier_repo.delete_supplier(supplier_id)
    if not deleted:
        raise HTTPException(status_code=400, detail="Failed to delete supplier")
    return {"message": "Supplier deleted successfully"}