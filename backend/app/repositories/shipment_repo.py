from fastapi import HTTPException
from app.config.database import execute_query
from app.schemas.shipment import ShipmentCreate, ShipmentUpdate
from typing import List, Optional
from datetime import date

async def get_all_shipments():
    query="""
    SELECT
        s.ShipmentID AS shipment_id,
        s.OrderID AS order_id,
        s.ShipmentDate AS shipment_date,
        o.OrderDate AS order_date,
        CASE 
            WHEN s.ShipmentDate IS NOT NULL 
            THEN DATE_PART('day', s.ShipmentDate::timestamp - o.OrderDate::timestamp)
            ELSE 0
            END AS delivery_days,
        json_agg(
        json_build_object(
            'product_id', p.ProductID,
            'product_name', p.Name,
            'quantity', sd.Quantity
        )
    ) AS details
FROM Shipments s
JOIN Orders o ON s.OrderID = o.OrderID
LEFT JOIN ShipmentDetails sd ON s.ShipmentID = sd.ShipmentID
LEFT JOIN Products p ON sd.ProductID = p.ProductID
GROUP BY s.ShipmentID, s.OrderID, s.ShipmentDate, o.OrderDate
ORDER BY s.ShipmentDate DESC;
"""
    return execute_query(query)

async def get_late_shipments():
    query="""
    SELECT
    o.OrderID as order_id,
    o.OrderDate as order_date,
    s.ShipmentID as shipment_id,
    s.ShipmentDate as shipment_date,
    CASE
        WHEN s.ShipmentDate IS NOT NULL
        THEN EXTRACT(DAY FROM (s.ShipmentDate::timestamp - o.OrderDate::timestamp))
        ELSE 0
    END AS delivery_days
FROM Orders o
LEFT OUTER JOIN Shipments s USING(OrderID)
WHERE s.ShipmentDate IS NULL
   OR (EXTRACT(EPOCH FROM (s.ShipmentDate::timestamp - o.OrderDate::timestamp)) / 86400) > 7
ORDER BY o.OrderDate;
    """
    return execute_query(query)

async def get_shipment_by_id(shipment_id: int):
    query = """
    SELECT 
        s.ShipmentID as shipment_id,
        s.OrderID as order_id,
        s.ShipmentDate as shipment_date,
        o.OrderDate as order_date,
        CASE 
            WHEN s.ShipmentDate IS NOT NULL 
            THEN DATE_PART('day', s.ShipmentDate::timestamp - o.OrderDate::timestamp)
            ELSE 0
        END AS delivery_days,

        json_agg(json_build_object(
            'product_id', p.ProductID,
            'product_name', p.Name,
            'quantity', sd.Quantity
        )) as details
    FROM Shipments s
    JOIN Orders o ON s.OrderID = o.OrderID
    LEFT JOIN ShipmentDetails sd ON s.ShipmentID = sd.ShipmentID
    LEFT JOIN Products p ON sd.ProductID = p.ProductID
    WHERE s.ShipmentID = %s
    GROUP BY s.ShipmentID, s.OrderID, s.ShipmentDate, o.OrderDate;
    """
    result = execute_query(query, (shipment_id,))
    return result[0] if result else None

async def create_shipment(shipment: ShipmentCreate):
    # Start transaction
    query = """
    INSERT INTO Shipments (OrderID, ShipmentDate)
    VALUES (%s, %s)
    RETURNING ShipmentID;
    """
    result = execute_query(
        query, 
        (shipment.order_id, shipment.shipment_date)
    )
    
    if result and shipment.details:
        shipment_id = result[0]['shipmentid']
        # Insert shipment details
        details_query = """
        INSERT INTO ShipmentDetails (ShipmentID, ProductID, Quantity)
        VALUES (%s, %s, %s);
        """
        for detail in shipment.details:
            execute_query(
                details_query,
                (shipment_id, detail.product_id, detail.quantity)
            )
        return await get_shipment_by_id(shipment_id)
    return None

async def update_shipment(shipment_id: int, shipment: ShipmentUpdate):
    update_fields = []
    params = []
    
    if shipment.shipment_date is not None:
        update_fields.append("ShipmentDate = %s")
        params.append(shipment.shipment_date)
    
    if not update_fields:
        return await get_shipment_by_id(shipment_id)
    
    query = f"""
    UPDATE Shipments 
    SET {", ".join(update_fields)}
    WHERE ShipmentID = %s
    RETURNING ShipmentID;
    """
    params.append(shipment_id)
    
    result = execute_query(query, tuple(params))
    
    if result and shipment.details:
        # Update shipment details
        # First delete existing details
        execute_query(
            "DELETE FROM ShipmentDetails WHERE ShipmentID = %s",
            (shipment_id,)
        )
        # Then insert new details
        details_query = """
        INSERT INTO ShipmentDetails (ShipmentID, ProductID, Quantity)
        VALUES (%s, %s, %s);
        """
        for detail in shipment.details:
            execute_query(
                details_query,
                (shipment_id, detail.product_id, detail.quantity)
            )
    
    if result:
        return await get_shipment_by_id(shipment_id)
    return None

async def delete_shipment(shipment_id: int):
    query = """
    DELETE FROM Shipments 
    WHERE ShipmentID = %s
    RETURNING ShipmentID;
    """
    result = execute_query(query, (shipment_id,))
    return bool(result)