from fastapi import APIRouter
from app.schemas.dashboard import (
    DashboardOverview,
    MonthlyMetrics,
    TopProducts,
    TopCustomers
)
from app.repositories import dashboard_repo
from typing import List

router = APIRouter()

@router.get("/overview", response_model=DashboardOverview)
async def get_overview():
    """Get current dashboard overview metrics"""
    return await dashboard_repo.get_overview()

@router.get("/monthly", response_model=List[MonthlyMetrics])
async def get_monthly_metrics():
    """Get monthly performance metrics"""
    return await dashboard_repo.get_monthly_metrics()

@router.get("/top-products", response_model=List[TopProducts])
async def get_top_products():
    """Get best-selling products"""
    return await dashboard_repo.get_top_products()

@router.get("/top-customers", response_model=List[TopCustomers])
async def get_top_customers():
    """Get highest value customers"""
    return await dashboard_repo.get_top_customers()