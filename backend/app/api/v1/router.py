from fastapi import APIRouter
from app.api.v1.endpoints import (
    dashboard,
    products,
    orders,
    suppliers,
    shipments,
    customers,
    inventory,
    analytics,
    payments,
    auth,
)

router = APIRouter()

# Include all endpoint routers
router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
router.include_router(products.router, prefix="/products", tags=["Products"])
router.include_router(orders.router, prefix="/orders", tags=["Orders"])
router.include_router(suppliers.router, prefix="/suppliers", tags=["Suppliers"])
router.include_router(shipments.router, prefix="/shipments", tags=["Shipments"])
router.include_router(customers.router, prefix="/customers", tags=["Customers"])
router.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
router.include_router(payments.router, prefix="/payments", tags=["Payments"])