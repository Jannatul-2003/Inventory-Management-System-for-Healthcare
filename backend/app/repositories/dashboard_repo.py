from app.config.database import execute_query
from datetime import date, timedelta

async def get_overview():
    query = """
    SELECT 
        (SELECT COUNT(DISTINCT o.OrderID) 
         FROM Orders o 
         WHERE o.OrderDate >= CURRENT_DATE - INTERVAL '30 days') as monthly_orders,
        (SELECT SUM(p.Price * od.Quantity)
         FROM Orders o 
         JOIN OrderDetails od USING(OrderID)
         JOIN Products p USING(ProductID)
         WHERE o.OrderDate >= CURRENT_DATE - INTERVAL '30 days') as monthly_revenue,
        (SELECT COUNT(DISTINCT CustomerID)
         FROM CustomerOrders co
         JOIN Orders o USING(OrderID)
         WHERE o.OrderDate >= CURRENT_DATE - INTERVAL '30 days') as active_customers,
        (SELECT COUNT(*)
         FROM Products p
         JOIN Inventory i USING(ProductID)
         WHERE i.Quantity < 10) as low_stock_items;
    """
    result = execute_query(query)
    return result[0] if result else None

async def get_monthly_metrics():
    query = """
    SELECT 
        DATE_TRUNC('month', OrderDate) AS month,
        COUNT(DISTINCT o.OrderID) AS total_orders,
        SUM(p.Price * od.Quantity) AS total_revenue,
        COUNT(DISTINCT CustomerID) AS unique_customers
    FROM Orders o
    JOIN OrderDetails od USING(OrderID)
    JOIN Products p USING(ProductID)
    JOIN CustomerOrders co USING(OrderID)
    GROUP BY DATE_TRUNC('month', OrderDate)
    ORDER BY month DESC
    LIMIT 12;
    """
    return execute_query(query)

async def get_top_products():
    query = """
    SELECT 
        p.ProductID as product_id,
        p.Name,
        SUM(od.Quantity) as total_sold,
        SUM(od.Quantity * p.Price) as total_revenue
    FROM Products p
    JOIN OrderDetails od USING(ProductID)
    JOIN Orders o USING(OrderID)
    WHERE o.OrderDate >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY p.ProductID, p.Name
    ORDER BY total_revenue DESC
    LIMIT 5;
    """
    return execute_query(query)

async def get_top_customers():
    query = """
    SELECT 
        c.CustomerID as customer_id,
        c.Name,
        COUNT(DISTINCT co.OrderID) as total_orders,
        SUM(od.Quantity * p.Price) as total_spent
    FROM Customers c
    JOIN CustomerOrders co USING(CustomerID)
    JOIN Orders o USING(OrderID)
    JOIN OrderDetails od USING(OrderID)
    JOIN Products p USING(ProductID)
    WHERE o.OrderDate >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY c.CustomerID, c.Name
    ORDER BY total_spent DESC
    LIMIT 5;
    """
    return execute_query(query)