from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, condecimal
import asyncpg
from typing import List, Optional
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
        db_pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=10)
    async with db_pool.acquire() as connection:
        yield connection


# Pydantic Models
class PurchaseCreate(BaseModel):
    account_id: str
    product_type: str
    product_name: str
    start_date: date
    end_date: date
    price: condecimal(gt=0, max_digits=10, decimal_places=2)
    data_usage: Optional[int] = 0
    call_minutes: Optional[int] = 0
    tv_hours: Optional[int] = 0


class PurchaseUpdate(BaseModel):
    end_date: Optional[date]
    price: Optional[condecimal(gt=0, max_digits=10, decimal_places=2)]
    data_usage: Optional[int]
    call_minutes: Optional[int]
    tv_hours: Optional[int]


# Fetch all purchases (Employees only: Admin & User)
@router.get("/purchases", dependencies=[Depends(require_role(["Admin", "User"]))])
async def get_purchases(db=Depends(get_db)):
    purchases = await db.fetch(
        """
        SELECT p.purchaseid, p.accountid, c.name AS customer_name, p.producttype, p.productname, 
               p.startdate, p.enddate, p.price, p.datausage, p.callminutes, p.tvhours
        FROM purchases p 
        JOIN customers c ON p.accountid = c.accountid
        """
    )
    return [dict(purchase) for purchase in purchases]


# Fetch a specific purchase (Employees only: Admin & User)
@router.get("/purchases/{purchase_id}", dependencies=[Depends(require_role(["Admin", "User"]))])
async def get_purchase(purchase_id: int, db=Depends(get_db)):
    purchase = await db.fetchrow(
        """
        SELECT p.purchaseid, p.accountid, c.name AS customer_name, p.producttype, p.productname, 
               p.startdate, p.enddate, p.price, p.datausage, p.callminutes, p.tvhours
        FROM purchases p 
        JOIN customers c ON p.accountid = c.accountid
        WHERE p.purchaseid = $1
        """, purchase_id
    )
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return dict(purchase)


# Create a new purchase (Admin only)
@router.post("/purchases", dependencies=[Depends(require_role("Admin"))])
async def create_purchase(purchase_data: PurchaseCreate, db=Depends(get_db)):
    purchase = await db.fetchrow(
        """
        INSERT INTO purchases (accountid, producttype, productname, startdate, enddate, price, datausage, callminutes, tvhours)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        """,
        purchase_data.account_id, purchase_data.product_type, purchase_data.product_name,
        purchase_data.start_date, purchase_data.end_date, purchase_data.price,
        purchase_data.data_usage, purchase_data.call_minutes, purchase_data.tv_hours
    )
    return dict(purchase)


# Update purchase details (Admin only)
@router.put("/purchases/{purchase_id}", dependencies=[Depends(require_role("Admin"))])
async def update_purchase(purchase_id: int, purchase_data: PurchaseUpdate, db=Depends(get_db)):
    existing_purchase = await db.fetchrow("SELECT purchaseid FROM purchases WHERE purchaseid = $1", purchase_id)
    if not existing_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    update_fields = {key: value for key, value in purchase_data.dict(exclude_unset=True).items()}
    if not update_fields:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    query = "UPDATE purchases SET " + ", ".join(
        f"{key} = ${idx + 1}" for idx, key in enumerate(update_fields.keys())) + " WHERE purchaseid = $" + str(
        len(update_fields) + 1)

    await db.execute(query, *update_fields.values(), purchase_id)
    return {"message": "Purchase updated successfully"}


# Delete a purchase (Admin only)
@router.delete("/purchases/{purchase_id}", dependencies=[Depends(require_role("Admin"))])
async def delete_purchase(purchase_id: int, db=Depends(get_db)):
    existing_purchase = await db.fetchrow("SELECT purchaseid FROM purchases WHERE purchaseid = $1", purchase_id)
    if not existing_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    await db.execute("DELETE FROM purchases WHERE purchaseid = $1", purchase_id)
    return {"message": "Purchase deleted successfully"}
