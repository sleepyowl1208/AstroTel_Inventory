from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, condecimal
import asyncpg
from typing import Optional
from auth_routes import require_role
from dotenv import load_dotenv
import os
from datetime import date

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

router = APIRouter()

db_pool: Optional[asyncpg.Pool] = None

async def get_db():
    global db_pool
    if db_pool is None:
        db_pool = await asyncpg.create_pool(DATABASE_URL)
    async with db_pool.acquire() as connection:
        yield connection

# Pydantic Models
class BillCreate(BaseModel):
    account_id: int
    customer_id: int
    total_amount: condecimal(gt=0, max_digits=10, decimal_places=2)
    due_date: date
    paid: bool

class BillUpdate(BaseModel):
    total_amount: Optional[condecimal(gt=0, max_digits=10, decimal_places=2)]
    due_date: Optional[date]
    paid: Optional[bool]

# Fetch all bills (Employees only: Admin & User)
@router.get("/billing")
async def get_bills(db=Depends(get_db)):
    bills = await db.fetch(
        """
        SELECT b.billid, b.account_id, b.customer_id, c.name AS customer_name, b.totalamount, b.duedate, b.paid 
        FROM billing b 
        JOIN customers c ON b.customer_id = c.customerid
        """
    )
    return [dict(bill) for bill in bills]

# Fetch a specific bill (Employees only: Admin & User)
@router.get("/billing/{bill_id}")
async def get_bill(bill_id: int, db=Depends(get_db)):
    bill = await db.fetchrow(
        """
        SELECT b.billid, b.account_id, b.customer_id, c.name AS customer_name, b.totalamount, b.duedate, b.paid 
        FROM billing b 
        JOIN customers c ON b.customer_id = c.customerid 
        WHERE b.billid = $1
        """, bill_id
    )
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return dict(bill)

# Create a new bill (Admin only)
@router.post("/billing", dependencies=[Depends(require_role("Admin"))])
async def create_bill(bill_data: BillCreate, db=Depends(get_db)):
    bill = await db.fetchrow(
        """
        INSERT INTO billing (account_id, customer_id, totalamount, duedate, paid)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        """,
        bill_data.account_id, bill_data.customer_id, bill_data.total_amount, bill_data.due_date, bill_data.paid
    )
    return dict(bill)

# Update bill details (Admin only)
@router.put("/billing/{bill_id}", dependencies=[Depends(require_role("Admin"))])
async def update_bill(bill_id: int, bill_data: BillUpdate, db=Depends(get_db)):
    existing_bill = await db.fetchrow("SELECT billid FROM billing WHERE billid = $1", bill_id)
    if not existing_bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    if not any([bill_data.total_amount, bill_data.due_date, bill_data.paid]):
        raise HTTPException(status_code=400, detail="No valid fields to update")
    await db.execute(
        """
        UPDATE billing SET totalamount = COALESCE($1, totalamount),
                           duedate = COALESCE($2, duedate),
                           paid = COALESCE($3, paid)
        WHERE billid = $4
        """,
        bill_data.total_amount, bill_data.due_date, bill_data.paid, bill_id
    )
    return {"message": "Bill updated successfully"}

# Delete a bill (Admin only)
@router.delete("/billing/{bill_id}", dependencies=[Depends(require_role("Admin"))])
async def delete_bill(bill_id: int, db=Depends(get_db)):
    existing_bill = await db.fetchrow("SELECT billid FROM billing WHERE billid = $1", bill_id)
    if not existing_bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    await db.execute("DELETE FROM billing WHERE billid = $1", bill_id)
    return {"message": "Bill deleted successfully"}
