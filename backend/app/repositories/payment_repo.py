from fastapi import HTTPException
from app.config.database import execute_query
from app.schemas.payment import PaymentCreate
from typing import List, Optional
from datetime import date

async def get_payments(start_date: Optional[date], end_date: Optional[date]):
    query = """
    SELECT 
        pd.PaymentID as payment_id,
        pd.OrderID as order_id,
        pd.PaymentDate as payment_date,
        pd.Amount as amount,
        o.OrderDate as order_date,
        c.Name as customer_name
    FROM PaymentDetails pd
    JOIN Orders o USING(OrderID)
    JOIN CustomerOrders co USING(OrderID)
    JOIN Customers c USING(CustomerID)
    WHERE 1=1
    """
    params = []
    if start_date:
        query += " AND pd.PaymentDate >= %s"
        params.append(start_date)
    if end_date:
        query += " AND pd.PaymentDate <= %s"
        params.append(end_date)
    
    query += " ORDER BY pd.PaymentDate DESC;"
    return execute_query(query, tuple(params) if params else None)

async def get_payment_analysis():
    query = """
    SELECT 
        CASE 
            WHEN grouping = 'Daily' THEN payment_date::text
            ELSE date_trunc
        END as date,
        grouping as period,
        total_payments
    FROM (
        SELECT 
            'Daily' as grouping,
            PaymentDate as payment_date,
            NULL as date_trunc,
            SUM(Amount) as total_payments
        FROM PaymentDetails
        GROUP BY PaymentDate
        UNION ALL
        SELECT 
            'Monthly',
            NULL,
            DATE_TRUNC('month', PaymentDate)::text,
            SUM(Amount)
        FROM PaymentDetails
        GROUP BY DATE_TRUNC('month', PaymentDate)
    ) payments
    ORDER BY 
        CASE WHEN grouping = 'Daily' 
            THEN payment_date::date 
            ELSE date_trunc::date 
        END DESC;
    """
    return execute_query(query)

async def get_payment_by_id(payment_id: int):
    query = """
    SELECT 
        pd.PaymentID as payment_id,
        pd.OrderID as order_id,
        pd.PaymentDate as payment_date,
        pd.Amount as amount,
        o.OrderDate as order_date,
        c.Name as customer_name
    FROM PaymentDetails pd
    JOIN Orders o USING(OrderID)
    JOIN CustomerOrders co USING(OrderID)
    JOIN Customers c USING(CustomerID)
    WHERE pd.PaymentID = %s;
    """
    result = execute_query(query, (payment_id,))
    return result[0] if result else None

async def create_payment(payment: PaymentCreate):
    query = """
    INSERT INTO PaymentDetails (OrderID, PaymentDate, Amount)
    VALUES (%s, %s, %s)
    RETURNING PaymentID;
    """
    result = execute_query(
        query, 
        (payment.order_id, payment.payment_date, float(payment.amount))
    )
    if result:
        return await get_payment_by_id(result[0]['paymentid'])
    return None