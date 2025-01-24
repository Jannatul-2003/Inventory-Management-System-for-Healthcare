from fastapi import HTTPException
from app.config.database import execute_query
from app.schemas.customer import CustomerCreate, CustomerUpdate
from typing import List, Optional

async def get_all_customers():
    query = """
    SELECT 
        c.CustomerID as customer_id,
        c.Name as name,
        c.ContactInfo as contact_info,
        COUNT(DISTINCT co.OrderID) as total_orders,
        COALESCE(SUM(od.Quantity * p.Price), 0) as total_spent
    FROM Customers c
    LEFT JOIN CustomerOrders co ON c.CustomerID = co.CustomerID
    LEFT JOIN OrderDetails od ON co.OrderID = od.OrderID
    LEFT JOIN Products p ON od.ProductID = p.ProductID
    GROUP BY c.CustomerID, c.Name, c.ContactInfo
    ORDER BY c.CustomerID;
    """
    return execute_query(query)

async def get_customer_by_id(customer_id: int):
    query = """
    SELECT 
        c.CustomerID as customer_id,
        c.Name as name,
        c.ContactInfo as contact_info,
        COUNT(DISTINCT co.OrderID) as total_orders,
        COALESCE(SUM(od.Quantity * p.Price), 0) as total_spent
    FROM Customers c
    LEFT JOIN CustomerOrders co ON c.CustomerID = co.CustomerID
    LEFT JOIN OrderDetails od ON co.OrderID = od.OrderID
    LEFT JOIN Products p ON od.ProductID = p.ProductID
    WHERE c.CustomerID = %s
    GROUP BY c.CustomerID, c.Name, c.ContactInfo;
    """
    result = execute_query(query, (customer_id,))
    return result[0] if result else None

async def get_customer_orders(customer_id: int):
    query = """
    SELECT 
        o.OrderID as order_id,
        o.OrderDate as order_date,
        p.Name as product_name,
        od.Quantity as quantity,
        p.Price as unit_price,
        (od.Quantity * p.Price) as total_price
    FROM Customers c
    JOIN CustomerOrders co USING(CustomerID)
    JOIN Orders o USING(OrderID)
    JOIN OrderDetails od USING(OrderID)
    JOIN Products p USING(ProductID)
    WHERE c.CustomerID = %s
    ORDER BY o.OrderDate DESC;
    """
    return execute_query(query, (customer_id,))

async def get_vip_customers():
    query = """
    SELECT 
        c.CustomerID as customer_id,
        c.Name as name,
        COUNT(DISTINCT co.OrderID) as total_orders,
        SUM(od.Quantity * p.Price) as total_spent
    FROM Customers c
    JOIN CustomerOrders co USING(CustomerID)
    JOIN OrderDetails od USING(OrderID)
    JOIN Products p USING(ProductID)
    GROUP BY c.CustomerID, c.Name
    HAVING SUM(od.Quantity * p.Price) > 1000
    ORDER BY total_spent DESC;
    """
    return execute_query(query)

async def create_customer(customer: CustomerCreate):
    query = """
    INSERT INTO Customers (Name, ContactInfo)
    VALUES (%s, %s)
    RETURNING CustomerID;
    """
    result = execute_query(
        query, 
        (customer.name, customer.contact_info)
    )
    if result:
        return await get_customer_by_id(result[0]['customerid'])
    return None

async def update_customer(customer_id: int, customer: CustomerUpdate):
    update_fields = []
    params = []
    if customer.name is not None:
        update_fields.append("Name = %s")
        params.append(customer.name)
    if customer.contact_info is not None:
        update_fields.append("ContactInfo = %s")
        params.append(customer.contact_info)
    
    if not update_fields:
        return await get_customer_by_id(customer_id)
    
    query = f"""
    UPDATE Customers 
    SET {", ".join(update_fields)}
    WHERE CustomerID = %s
    RETURNING CustomerID;
    """
    params.append(customer_id)
    
    result = execute_query(query, tuple(params))
    if result:
        return await get_customer_by_id(customer_id)
    return None

async def delete_customer(customer_id: int):
    query = """
    DELETE FROM Customers 
    WHERE CustomerID = %s
    RETURNING CustomerID;
    """
    result = execute_query(query, (customer_id,))
    return bool(result)

async def search_customers(search_term: str):
    query = """
    SELECT 
        c.CustomerID as customer_id,
        c.Name as name,
        c.ContactInfo as contact_info,
        COUNT(DISTINCT co.OrderID) as total_orders,
        COALESCE(SUM(od.Quantity * p.Price), 0) as total_spent
    FROM Customers c
    LEFT JOIN CustomerOrders co ON c.CustomerID = co.CustomerID
    LEFT JOIN OrderDetails od ON co.OrderID = od.OrderID
    LEFT JOIN Products p ON od.ProductID = p.ProductID
    WHERE LOWER(c.Name) LIKE LOWER(%s)
    GROUP BY c.CustomerID, c.Name, c.ContactInfo;
    """
    search_pattern = f"%{search_term}%"
    return execute_query(query, (search_pattern,))