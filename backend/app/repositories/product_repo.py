from fastapi import HTTPException
from app.config.database import execute_query
from app.schemas.product import ProductCreate, ProductUpdate
from typing import List, Optional
from psycopg2.extras import RealDictCursor


async def get_all_products():
    query = """
    SELECT 
        p.ProductID as product_id,
        p.Name as name,
        p.Description as description,
        p.Price as price,
        COALESCE(i.Quantity, 0) as current_stock,
        CASE 
            WHEN COALESCE(i.Quantity, 0) = 0 THEN 'Out of Stock'
            WHEN COALESCE(i.Quantity, 0) < 10 THEN 'Low Stock'
            ELSE 'In Stock'
        END as stock_status
    FROM Products p
    LEFT JOIN Inventory i ON p.ProductID = i.ProductID
    ORDER BY p.ProductID;
    """
    return  execute_query(query)

# async def get_product_by_id(product_id: int):
#     query = """
#     SELECT 
#         p.ProductID as product_id,
#         p.Name as name,
#         p.Description as description,
#         p.Price as price,
#         COALESCE(i.Quantity, 0) as current_stock,
#         CASE 
#             WHEN COALESCE(i.Quantity, 0) = 0 THEN 'Out of Stock'
#             WHEN COALESCE(i.Quantity, 0) < 10 THEN 'Low Stock'
#             ELSE 'In Stock'
#         END as stock_status
#     FROM Products p
#     LEFT JOIN Inventory i ON p.ProductID = i.ProductID
#     WHERE p.ProductID = %s;
#     """
#     result = execute_query(query, (product_id,))
#     return result[0] if result else None

async def get_product_by_id(product_id: int):
    query = """
    SELECT 
        p.ProductID as product_id,
        p.Name as name,
        p.Description as description,
        p.Price as price,
        COALESCE(i.Quantity, 0) as current_stock,
        CASE 
            WHEN COALESCE(i.Quantity, 0) = 0 THEN 'Out of Stock'
            WHEN COALESCE(i.Quantity, 0) < 10 THEN 'Low Stock'
            ELSE 'In Stock'
        END as stock_status
    FROM Products p
    LEFT JOIN Inventory i ON p.ProductID = i.ProductID
    WHERE p.ProductID = %s;
    """
    try:
        result = execute_query(query, (product_id,))
        print(f"Query result: {result}")  # Debugging log
        if result:  # Ensure only valid results are returned
            return result[0]
        return None  # Return None explicitly if no rows found
    except Exception as e:
        print(f"Error in get_product_by_id: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


async def create_product(product: ProductCreate):
    query = """
    INSERT INTO Products (Name, Description, Price)
    VALUES (%s, %s, %s)
    RETURNING ProductID;
    """
    result = execute_query(
        query, 
        (product.name, product.description, float(product.price))
    )
    if result:
        return await get_product_by_id(result[0]['productid'])
    return None

async def update_product(product_id: int, product: ProductUpdate):
    # Build dynamic update query based on provided fields
    update_fields = []
    params = []
    if product.name is not None:
        update_fields.append("Name = %s")
        params.append(product.name)
    if product.description is not None:
        update_fields.append("Description = %s")
        params.append(product.description)
    if product.price is not None:
        update_fields.append("Price = %s")
        params.append(float(product.price))
    
    if not update_fields:
        return await get_product_by_id(product_id)
    
    query = f"""
    UPDATE Products 
    SET {", ".join(update_fields)}
    WHERE ProductID = %s
    RETURNING ProductID;
    """
    params.append(product_id)
    
    result =  execute_query(query, tuple(params))
    if result:
        return await get_product_by_id(product_id)
    return None

async def delete_product(product_id: int):
    query = """
    DELETE FROM Products 
    WHERE ProductID = %s
    RETURNING ProductID;
    """
    result =  execute_query(query, (product_id,))
    return bool(result)

async def search_products(search_term: str):
    query = """
    SELECT 
        p.ProductID as product_id,
        p.Name as name,
        p.Description as description,
        p.Price as price,
        COALESCE(i.Quantity, 0) as current_stock,
        CASE 
            WHEN COALESCE(i.Quantity, 0) = 0 THEN 'Out of Stock'
            WHEN COALESCE(i.Quantity, 0) < 10 THEN 'Low Stock'
            ELSE 'In Stock'
        END as stock_status
    FROM Products p
    LEFT JOIN Inventory i ON p.ProductID = i.ProductID
    WHERE LOWER(p.Name) LIKE LOWER(%s)
    OR LOWER(p.Description) LIKE LOWER(%s)
    ORDER BY p.ProductID;
    """
    search_pattern = f"%{search_term}%"
    return  execute_query(query, (search_pattern, search_pattern))