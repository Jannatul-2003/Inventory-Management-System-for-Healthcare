# File: app/api/v1/endpoints/analytics.py
from fastapi import APIRouter, Query
from app.schemas.analytics import (
    SalesAnalytics,
    ProductAnalytics,
    CustomerAnalytics,
    SupplierAnalytics,
    TrendAnalytics
)
from app.repositories import analytics_repo
from typing import List
from datetime import date

router = APIRouter()

@router.get("/sales", response_model=List[SalesAnalytics])
async def get_sales_analytics(
    start_date: date = Query(None),
    end_date: date = Query(None)
):
    return await analytics_repo.get_sales_analytics(start_date, end_date)

@router.get("/products", response_model=List[ProductAnalytics])
async def get_product_analytics():
    return await analytics_repo.get_product_analytics()

@router.get("/customers", response_model=List[CustomerAnalytics])
async def get_customer_analytics():
    return await analytics_repo.get_customer_analytics()

@router.get("/suppliers", response_model=List[SupplierAnalytics])
async def get_supplier_analytics():
    return await analytics_repo.get_supplier_analytics()

@router.get("/trends", response_model=List[TrendAnalytics])
async def get_trend_analytics():
    return await analytics_repo.get_trend_analytics()