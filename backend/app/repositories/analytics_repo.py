# File: app/repositories/analytics_repo.py
from app.config.database import execute_query
from typing import Optional
from datetime import date

async def get_sales_analytics(start_date: Optional[date], end_date: Optional[date]):
    query = """
    WITH DailySales AS (
        SELECT 
            DATE_TRUNC('day', o.OrderDate) as sale_date,
            COUNT(DISTINCT o.OrderID) as orders,
            COUNT(DISTINCT co.CustomerID) as customers,
            SUM(od.Quantity) as units_sold,
            SUM(od.Quantity * p.Price) as revenue
        FROM Orders o
        JOIN OrderDetails od USING(OrderID)
        JOIN Products p USING(ProductID)
        JOIN CustomerOrders co USING(OrderID)
        WHERE 1=1
    """
    params = []
    if start_date:
        query += " AND o.OrderDate >= %s"
        params.append(start_date)
    if end_date:
        query += " AND o.OrderDate <= %s"
        params.append(end_date)
    
    query += """
        GROUP BY DATE_TRUNC('day', o.OrderDate)
    )
    SELECT 
        sale_date,
        orders,
        customers,
        units_sold,
        revenue,
        LAG(revenue) OVER (ORDER BY sale_date) as prev_revenue,
        (revenue - LAG(revenue) OVER (ORDER BY sale_date)) / 
            NULLIF(LAG(revenue) OVER (ORDER BY sale_date), 0) * 100 as growth_rate
    FROM DailySales
    ORDER BY sale_date DESC;
    """
    return execute_query(query, tuple(params) if params else None)

async def get_product_analytics():
    query = """
    SELECT 
        p.ProductID,
        p.Name,
        COUNT(DISTINCT o.OrderID) as order_count,
        SUM(od.Quantity) as total_units,
        SUM(od.Quantity * p.Price) as total_revenue,
        AVG(od.Quantity) as avg_order_size,
        COALESCE(i.Quantity, 0) as current_stock,
        COALESCE(
            SUM(od.Quantity) * 1.0 / NULLIF(COUNT(DISTINCT DATE_TRUNC('month', o.OrderDate)), 0),
            0
        ) as monthly_velocity
    FROM Products p
    LEFT JOIN OrderDetails od USING(ProductID)
    LEFT JOIN Orders o USING(OrderID)
    LEFT JOIN Inventory i USING(ProductID)
    GROUP BY p.ProductID, p.Name, i.Quantity
    ORDER BY total_revenue DESC NULLS LAST;
    """
    return execute_query(query)

async def get_customer_analytics():
    query = """
    WITH CustomerStats AS (
        SELECT 
            c.CustomerID,
            c.Name,
            COUNT(DISTINCT o.OrderID) as total_orders,
            SUM(od.Quantity * p.Price) as total_spent,
            MIN(o.OrderDate) as first_order,
            MAX(o.OrderDate) as last_order
        FROM Customers c
        JOIN CustomerOrders co USING(CustomerID)
        JOIN Orders o USING(OrderID)
        JOIN OrderDetails od USING(OrderID)
        JOIN Products p USING(ProductID)
        GROUP BY c.CustomerID, c.Name
    )
    SELECT 
        CustomerID,
        Name,
        total_orders,
        total_spent,
        first_order,
        last_order,
        total_spent / total_orders as avg_order_value,
        DATE_PART('day', last_order::timestamp - first_order::timestamp) as customer_lifetime_days
    FROM CustomerStats
    ORDER BY total_spent DESC;
    """
    return execute_query(query)

async def get_supplier_analytics():
    query = """
    WITH SupplierStats AS (
        SELECT 
            s.SupplierID,
            s.Name,
            COUNT(DISTINCT o.OrderID) as total_orders,
            SUM(od.Quantity) as total_units,
            SUM(od.Quantity * p.Price) as total_value,
            AVG(DATE_PART('day', sh.ShipmentDate::timestamp - o.OrderDate::timestamp)) as avg_delivery_days
        FROM Suppliers s
        JOIN Orders o USING(SupplierID)
        JOIN OrderDetails od USING(OrderID)
        JOIN Products p USING(ProductID)
        LEFT JOIN Shipments sh USING(OrderID)
        GROUP BY s.SupplierID, s.Name
    )
    SELECT 
        *,
        total_value / NULLIF(total_orders, 0) as avg_order_value,
        CASE 
            WHEN avg_delivery_days <= 3 THEN 'Excellent'
            WHEN avg_delivery_days <= 5 THEN 'Good'
            WHEN avg_delivery_days <= 7 THEN 'Fair'
            ELSE 'Poor'
        END as performance_rating
    FROM SupplierStats
    ORDER BY total_value DESC;
    """
    return execute_query(query)

async def get_trend_analytics():
    query = """
    WITH MonthlyMetrics AS (
        SELECT 
            DATE_TRUNC('month', o.OrderDate) as month,
            COUNT(DISTINCT o.OrderID) as orders,
            COUNT(DISTINCT co.CustomerID) as customers,
            SUM(od.Quantity) as units,
            SUM(od.Quantity * p.Price) as revenue,
            COUNT(DISTINCT p.ProductID) as unique_products
        FROM Orders o
        JOIN OrderDetails od USING(OrderID)
        JOIN Products p USING(ProductID)
        JOIN CustomerOrders co USING(OrderID)
        GROUP BY DATE_TRUNC('month', o.OrderDate)
    )
    SELECT 
        month,
        orders,
        customers,
        units,
        revenue,
        unique_products,
        LAG(revenue) OVER (ORDER BY month) as prev_revenue,
        (revenue - LAG(revenue) OVER (ORDER BY month)) / 
            NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100 as revenue_growth,
        revenue / NULLIF(orders, 0) as avg_order_value,
        units / NULLIF(orders, 0) as avg_units_per_order
    FROM MonthlyMetrics
    ORDER BY month DESC;
    """
    return execute_query(query)
