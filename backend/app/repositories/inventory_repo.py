from fastapi import HTTPException
from app.config.database import execute_query
from typing import List, Optional


async def get_all_inventory():
    query = """
    SELECT 
        i.InventoryID as inventory_id,
        p.ProductID as product_id,
        p.Name as product_name,
        p.Price as price,
        i.Quantity as quantity,
        CASE 
            WHEN i.Quantity = 0 THEN 'Out of Stock'
            WHEN i.Quantity < 10 THEN 'Low Stock'
            ELSE 'In Stock'
        END as status
    FROM Inventory i
    JOIN Products p USING(ProductID)
    ORDER BY p.Name;
    """
    return execute_query(query)

async def get_low_stock_items():
    query = """
    SELECT 
        i.InventoryID as inventory_id,
        p.ProductID as product_id,
        p.Name as product_name,
        p.Price as price,
        i.Quantity as quantity,
        CASE 
            WHEN i.Quantity = 0 THEN 'Out of Stock'
            WHEN i.Quantity < 10 THEN 'Low Stock'
            ELSE 'In Stock'
        END as status
    FROM Inventory i
    JOIN Products p USING(ProductID)
    WHERE i.Quantity < 10
    ORDER BY i.Quantity;
    """
    return execute_query(query)

async def get_stock_alerts():
    query = """
    SELECT 
        p.ProductID AS product_id, 
        p.Name AS name, 
        p.Description AS description, 
        p.Price AS price
    FROM Products p
    JOIN Inventory i USING(ProductID)
    WHERE i.Quantity < ALL (
        SELECT AVG(Quantity)
        FROM Inventory
        GROUP BY ProductID
        HAVING AVG(Quantity) > 10
    );
    """
    return execute_query(query)

async def get_inventory_by_product(product_id: int):
    query = """
    SELECT 
        i.InventoryID as inventory_id,
        p.ProductID as product_id,
        p.Name as product_name,
        p.Price as price,
        i.Quantity as quantity,
        CASE 
            WHEN i.Quantity = 0 THEN 'Out of Stock'
            WHEN i.Quantity < 10 THEN 'Low Stock'
            ELSE 'In Stock'
        END as status
    FROM Inventory i
    JOIN Products p USING(ProductID)
    WHERE p.ProductID = %s;
    """
    result = execute_query(query, (product_id,))
    return result[0] if result else None

async def update_inventory(product_id: int, quantity: int):
    query = """
    UPDATE Inventory
    SET Quantity = %s
    WHERE ProductID = %s
    RETURNING InventoryID;
    """
    result = execute_query(query, (quantity, product_id))
    if result:
        return await get_inventory_by_product(product_id)
    return None