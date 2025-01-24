from fastapi import APIRouter, HTTPException, Query, Path
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.repositories import product_repo
from typing import List, Optional

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    search: Optional[str] = Query(None, description="Search term for product name or description")
):
    """
    Get all products or search products if search term is provided
    """
    if search:
        return await product_repo.search_products(search)
    return await product_repo.get_all_products()

@router.get("/{product_id}")
async def get_product(
    product_id: int = Path(..., gt=0, description="The ID of the product to get")
):
    """
    Get a specific product by ID
    """
    
    product = await product_repo.get_product_by_id(product_id)
    print(product)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found") 
    return product

@router.post("/", response_model=ProductResponse)
async def create_product(product: ProductCreate):
    """
    Create a new product
    """
    return await product_repo.create_product(product)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int = Path(..., gt=0),
    product: ProductUpdate = None
):
    """
    Update a product
    """
    existing_product = await product_repo.get_product_by_id(product_id)
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = await product_repo.update_product(product_id, product)
    if not updated_product:
        raise HTTPException(status_code=400, detail="Failed to update product")
    return updated_product

@router.delete("/{product_id}")
async def delete_product(
    product_id: int = Path(..., gt=0)
):
    """
    Delete a product
    """
    existing_product = await product_repo.get_product_by_id(product_id)
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    deleted = await product_repo.delete_product(product_id)
    if not deleted:
        raise HTTPException(status_code=400, detail="Failed to delete product")
    return {"message": "Product deleted successfully"}