from fastapi import HTTPException
from app.config.database import execute_query
from app.schemas.supplier import SupplierCreate, SupplierUpdate
from typing import List, Optional

async def get_all_suppliers():
    query = """
    SELECT 
        s.id as supplier_id,
        s.Name as name,
        s.ContactInfo as contact_info,
        COUNT(DISTINCT o.OrderID) as total_orders,
        COALESCE(AVG(CASE WHEN sh.ShipmentDate IS NOT NULL 
                 THEN DATE_PART('day', sh.ShipmentDate::timestamp - o.OrderDate::timestamp)
                 ELSE 0 END), 0) as avg_delivery_days
    FROM Users s
    LEFT JOIN Orders o ON s.id = o.SupplierID
    LEFT JOIN Shipments sh ON o.OrderID = sh.OrderID
    WHERE s.Role = 'supplier'
    GROUP BY s.id, s.Name, s.ContactInfo
    ORDER BY s.id;
    """
    return execute_query(query)

async def get_supplier_by_id(supplier_id: int):
    query = """
    SELECT 
        s.id as supplier_id,
        s.Name as name,
        s.ContactInfo as contact_info,
        COUNT(DISTINCT o.OrderID) as total_orders,
        COALESCE(AVG(CASE WHEN sh.ShipmentDate IS NOT NULL 
                 THEN DATE_PART('day', sh.ShipmentDate::timestamp - o.OrderDate::timestamp)
                 ELSE 0 END), 0) as avg_delivery_days    
    FROM Users s
    LEFT JOIN Orders o ON s.id = o.SupplierID
    LEFT JOIN Shipments sh ON o.OrderID = sh.OrderID
    WHERE s.id = %s AND s.Role = 'supplier'
    GROUP BY s.id, s.Name, s.ContactInfo;
    """
    result = execute_query(query, (supplier_id,))
    return result[0] if result else None

async def get_supplier_performance():
    query="""
    WITH SupplierStats AS (
        SELECT 
            s.id as supplier_id,
            s.Name,
            COUNT(DISTINCT o.OrderID) AS total_orders,
            COALESCE(AVG(CASE WHEN sh.ShipmentDate IS NOT NULL 
                THEN DATE_PART('day', sh.ShipmentDate::timestamp - o.OrderDate::timestamp)
                ELSE 0 END), 0) as avg_delivery_days
        FROM Users s
        JOIN Orders o ON s.id = o.SupplierID
        JOIN Shipments sh USING(OrderID)
        GROUP BY s.id, s.Name
    )
    SELECT 
        supplier_id,
        Name as name,
        total_orders,
        avg_delivery_days
    FROM SupplierStats
    WHERE avg_delivery_days < (SELECT AVG(avg_delivery_days) FROM SupplierStats)
    ORDER BY total_orders DESC;
    """
    return execute_query(query)

async def create_supplier(supplier: SupplierCreate):
    query = """
    INSERT INTO Users (Name, ContactInfo, Role)
    VALUES (%s, %s, 'supplier')
    RETURNING id;
    """
    result = execute_query(query, (supplier.name, supplier.contact_info))
    if result:
        return await get_supplier_by_id(result[0]['id'])
    return None

async def update_supplier(supplier_id: int, supplier: SupplierUpdate):
    update_fields = []
    params = []
    if supplier.name is not None:
        update_fields.append("Name = %s")
        params.append(supplier.name)
    if supplier.contact_info is not None:
        update_fields.append("ContactInfo = %s")
        params.append(supplier.contact_info)
    
    if not update_fields:
        return await get_supplier_by_id(supplier_id)
    
    query = f"""
    UPDATE Users 
    SET {", ".join(update_fields)}
    WHERE id = %s AND Role = 'supplier'
    RETURNING id;
    """
    params.append(supplier_id)
    
    result = execute_query(query, tuple(params))
    if result:
        return await get_supplier_by_id(supplier_id)
    return None

async def delete_supplier(supplier_id: int):
    query = """
    DELETE FROM users 
    WHERE id = %s AND Role = 'supplier'
    RETURNING id;
    """
    result = execute_query(query, (supplier_id,))
    return bool(result)

async def search_suppliers(search_term: str):
    query = """
    SELECT 
        s.id as supplier_id,
        s.Name as name,
        s.ContactInfo as contact_info,
        COUNT(DISTINCT o.OrderID) as total_orders,
        COALESCE(AVG(CASE WHEN sh.ShipmentDate IS NOT NULL 
                THEN DATE_PART('day', sh.ShipmentDate::timestamp - o.OrderDate::timestamp)
                ELSE 0 END), 0) as avg_delivery_days
    FROM Users s
    LEFT JOIN Orders o ON s.id = o.SupplierID
    LEFT JOIN Shipments sh ON o.OrderID = sh.OrderID
    WHERE LOWER(s.Name) LIKE LOWER(%s) AND s.Role = 'supplier'
    GROUP BY s.id, s.Name, s.ContactInfo;
    """
    search_pattern = f"%{search_term}%"
    return execute_query(query, (search_pattern,))