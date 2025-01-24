from fastapi import APIRouter, HTTPException, Query, Path
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse, CustomerOrderHistory, CustomerValueAnalysis
from app.repositories import customer_repo
from typing import List, Optional

router = APIRouter()

@router.get("/", response_model=List[CustomerResponse])
async def get_customers(
    search: Optional[str] = Query(None, description="Search term for customer name"),
    vip_only: bool = Query(False, description="Filter for VIP customers only")
):
    """Get all customers or search customers if search term is provided"""
    if vip_only:
        return await customer_repo.get_vip_customers()
    if search:
        return await customer_repo.search_customers(search)
    return await customer_repo.get_all_customers()

@router.get("/vip", response_model=List[CustomerValueAnalysis])
async def get_vip_customers():
    """Get high-value customers (total spent > 1000)"""
    return await customer_repo.get_vip_customers()

@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: int = Path(..., gt=0)
):
    """Get a specific customer by ID"""
    customer = await customer_repo.get_customer_by_id(customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.get("/{customer_id}/orders", response_model=List[CustomerOrderHistory])
async def get_customer_orders(
    customer_id: int = Path(..., gt=0)
):
    """Get order history for a specific customer"""
    customer = await customer_repo.get_customer_by_id(customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return await customer_repo.get_customer_orders(customer_id)

@router.post("/", response_model=CustomerResponse)
async def create_customer(customer: CustomerCreate):
    """Create a new customer"""
    return await customer_repo.create_customer(customer)

@router.put("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: int = Path(..., gt=0),
    customer: CustomerUpdate = None
):
    """Update a customer"""
    if customer is None:
        raise HTTPException(status_code=400, detail="Request body is required")
        
    existing_customer = await customer_repo.get_customer_by_id(customer_id)
    if not existing_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    updated_customer = await customer_repo.update_customer(customer_id, customer)
    if not updated_customer:
        raise HTTPException(status_code=400, detail="Failed to update customer")
    return updated_customer

@router.delete("/{customer_id}")
async def delete_customer(
    customer_id: int = Path(..., gt=0)
):
    """Delete a customer"""
    existing_customer = await customer_repo.get_customer_by_id(customer_id)
    if not existing_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    deleted = await customer_repo.delete_customer(customer_id)
    if not deleted:
        raise HTTPException(status_code=400, detail="Failed to delete customer")
    return {"message": "Customer deleted successfully"}