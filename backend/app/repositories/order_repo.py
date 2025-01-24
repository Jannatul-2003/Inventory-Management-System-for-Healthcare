
# File: app/repositories/order_repo.py
from fastapi import HTTPException
from app.config.database import execute_query
from app.schemas.order import OrderCreate, OrderUpdate
from typing import List, Optional
from datetime import date

async def get_orders(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    customer_id: Optional[int] = None,
    supplier_id: Optional[int] = None
):
    query = """
    SELECT 
        o.OrderID as order_id,
        o.OrderDate as order_date,
        s.SupplierID as supplier_id,
        s.Name as supplier_name,
        c.CustomerID as customer_id,
        c.Name as customer_name,
        COUNT(od.ProductID) as total_items,
        SUM(od.Quantity) as total_quantity,
        SUM(od.Quantity * p.Price) as total_amount,
        COALESCE(pd.Amount, 0) as amount_paid,
        CASE 
            WHEN sh.ShipmentDate IS NOT NULL THEN 'Shipped'
            WHEN pd.Amount IS NOT NULL THEN 'Paid'
            ELSE 'Pending'
        END as status
    FROM Orders o
    JOIN Suppliers s ON o.SupplierID = s.SupplierID
    JOIN CustomerOrders co ON o.OrderID = co.OrderID
    JOIN Customers c ON co.CustomerID = c.CustomerID
    JOIN OrderDetails od ON o.OrderID = od.OrderID
    JOIN Products p ON od.ProductID = p.ProductID
    LEFT JOIN PaymentDetails pd ON o.OrderID = pd.OrderID
    LEFT JOIN Shipments sh ON o.OrderID = sh.OrderID
    WHERE 1=1
    """
    params = []
    
    if start_date:
        query += " AND o.OrderDate >= %s"
        params.append(start_date)
    if end_date:
        query += " AND o.OrderDate <= %s"
        params.append(end_date)
    if customer_id:
        query += " AND c.CustomerID = %s"
        params.append(customer_id)
    if supplier_id:
        query += " AND s.SupplierID = %s"
        params.append(supplier_id)
    
    query += """
    GROUP BY o.OrderID, o.OrderDate, s.SupplierID, s.Name, 
             c.CustomerID, c.Name, pd.Amount, sh.ShipmentDate
    ORDER BY o.OrderDate DESC;
    """
    
    return execute_query(query, tuple(params) if params else None)

async def get_order_summary():
    query = """
    SELECT 
        o.OrderID as order_id,
        o.OrderDate as order_date,
        s.Name as supplier_name,
        c.Name as customer_name,
        SUM(od.Quantity * p.Price) as total_amount
    FROM Orders o
    JOIN Suppliers s USING(SupplierID)
    JOIN CustomerOrders co USING(OrderID)
    JOIN Customers c USING(CustomerID)
    JOIN OrderDetails od USING(OrderID)
    JOIN Products p USING(ProductID)
    GROUP BY o.OrderID, o.OrderDate, s.Name, c.Name
    ORDER BY o.OrderDate DESC;
    """
    return execute_query(query)

async def get_order_status():
    query = """
    SELECT 
        o.OrderID as order_id,
        COUNT(od.ProductID) as total_items,
        SUM(od.Quantity) as total_quantity,
        SUM(od.Quantity * p.Price) as total_amount,
        COALESCE(pd.Amount, 0) as amount_paid,
        CASE 
            WHEN sh.ShipmentDate IS NOT NULL THEN 'Shipped'
            WHEN pd.Amount IS NOT NULL THEN 'Paid'
            ELSE 'Pending'
        END as status
    FROM Orders o
    JOIN OrderDetails od USING(OrderID)
    JOIN Products p USING(ProductID)
    LEFT JOIN PaymentDetails pd USING(OrderID)
    LEFT JOIN Shipments sh USING(OrderID)
    GROUP BY o.OrderID, pd.Amount, sh.ShipmentDate
    ORDER BY o.OrderID;
    """
    return execute_query(query)

async def get_order_by_id(order_id: int):
    query = """
    SELECT 
        o.OrderID as order_id,
        o.OrderDate as order_date,
        s.SupplierID as supplier_id,
        s.Name as supplier_name,
        c.CustomerID as customer_id,
        c.Name as customer_name,
        COUNT(od.ProductID) as total_items,
        SUM(od.Quantity) as total_quantity,
        SUM(od.Quantity * p.Price) as total_amount,
        COALESCE(pd.Amount, 0) as amount_paid,
        CASE 
            WHEN sh.ShipmentDate IS NOT NULL THEN 'Shipped'
            WHEN pd.Amount IS NOT NULL THEN 'Paid'
            ELSE 'Pending'
        END as status
    FROM Orders o
    JOIN Suppliers s ON o.SupplierID = s.SupplierID
    JOIN CustomerOrders co ON o.OrderID = co.OrderID
    JOIN Customers c ON co.CustomerID = c.CustomerID
    JOIN OrderDetails od ON o.OrderID = od.OrderID
    JOIN Products p ON od.ProductID = p.ProductID
    LEFT JOIN PaymentDetails pd ON o.OrderID = pd.OrderID
    LEFT JOIN Shipments sh ON o.OrderID = sh.OrderID
    WHERE o.OrderID = %s
    GROUP BY o.OrderID, o.OrderDate, s.SupplierID, s.Name, 
             c.CustomerID, c.Name, pd.Amount, sh.ShipmentDate;
    """
    result = execute_query(query, (order_id,))
    return result[0] if result else None

async def get_order_details(order_id: int):
    query = """
    SELECT 
        od.OrderDetailID as order_detail_id,
        p.ProductID as product_id,
        p.Name as product_name,
        od.Quantity as quantity,
        p.Price as unit_price,
        (od.Quantity * p.Price) as total_price
    FROM OrderDetails od
    JOIN Products p ON od.ProductID = p.ProductID
    WHERE od.OrderID = %s;
    """
    return execute_query(query, (order_id,))

async def create_order(order: OrderCreate):
    # Start transaction
    order_query = """
    INSERT INTO Orders (OrderDate, SupplierID)
    VALUES (%s, %s)
    RETURNING OrderID;
    """
    order_result = execute_query(
        order_query, 
        (order.order_date, order.supplier_id)
    )
    
    if order_result:
        order_id = order_result[0]['orderid']
        
        # Link customer to order
        customer_order_query = """
        INSERT INTO CustomerOrders (CustomerID, OrderID)
        VALUES (%s, %s);
        """
        execute_query(customer_order_query, (order.customer_id, order_id))
        
        # Insert order details
        details_query = """
        INSERT INTO OrderDetails (OrderID, ProductID, Quantity)
        VALUES (%s, %s, %s);
        """
        for detail in order.details:
            execute_query(
                details_query,
                (order_id, detail.product_id, detail.quantity)
            )
        
        return await get_order_by_id(order_id)
    return None

async def update_order(order_id: int, order: OrderUpdate):
    update_fields = []
    params = []
    
    if order.order_date is not None:
        update_fields.append("OrderDate = %s")
        params.append(order.order_date)
    if order.supplier_id is not None:
        update_fields.append("SupplierID = %s")
        params.append(order.supplier_id)
    
    if not update_fields:
        return await get_order_by_id(order_id)
    
    query = f"""
    UPDATE Orders 
    SET {", ".join(update_fields)}
    WHERE OrderID = %s
    RETURNING OrderID;
    """
    params.append(order_id)
    
    result = execute_query(query, tuple(params))
    
    if result and order.details:
        # Update order details
        # First delete existing details
        execute_query(
            "DELETE FROM OrderDetails WHERE OrderID = %s",
            (order_id,)
        )
        # Then insert new details
        details_query = """
        INSERT INTO OrderDetails (OrderID, ProductID, Quantity)
        VALUES (%s, %s, %s);
        """
        for detail in order.details:
            execute_query(
                details_query,
                (order_id, detail.product_id, detail.quantity)
            )
    
    if result:
        return await get_order_by_id(order_id)
    return None

async def check_order_shipped(order_id: int):
    query = """
    SELECT 1 
    FROM Shipments 
    WHERE OrderID = %s;
    """
    result = execute_query(query, (order_id,))
    return bool(result)

async def delete_order(order_id: int):
    query = """
    DELETE FROM Orders 
    WHERE OrderID = %s
    AND NOT EXISTS (
        SELECT 1 FROM Shipments WHERE OrderID = %s
    )
    RETURNING OrderID;
    """
    result = execute_query(query, (order_id, order_id))
    return bool(result)