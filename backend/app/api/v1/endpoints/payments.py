from fastapi import APIRouter, HTTPException, Query, Path
from app.schemas.payment import PaymentCreate, PaymentResponse, PaymentAnalysis
from app.repositories import payment_repo
from typing import List, Optional
from datetime import date

router = APIRouter()

@router.get("/", response_model=List[PaymentResponse])
async def get_payments(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None)
):
    return await payment_repo.get_payments(start_date, end_date)

@router.get("/analysis", response_model=List[PaymentAnalysis])
async def get_payment_analysis():
    return await payment_repo.get_payment_analysis()

@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: int = Path(..., gt=0)
):
    payment = await payment_repo.get_payment_by_id(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.post("/", response_model=PaymentResponse)
async def create_payment(payment: PaymentCreate):
    return await payment_repo.create_payment(payment)