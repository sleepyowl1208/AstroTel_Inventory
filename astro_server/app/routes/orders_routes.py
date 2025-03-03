from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, condecimal
import asyncpg
from typing import List, Optional
from auth_routes import require_role
from dotenv import load_dotenv
import os
from datetime import datetime
from fastapi import FastAPI

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Initialize FastAPI Router
router = APIRouter()

# Global database pool
db_pool: Optional[asyncpg.Pool] = None

# FastAPI app events for DB connection handling
app = FastAPI()


@app.on_event("startup")
async def startup():
    global db_pool
    db_pool = await asyncpg.create_pool(DATABASE_URL)


@app.on_event("shutdown")
async def shutdown():
    global db_pool
    if db_pool:
        await db_pool.close()


# Dependency to get a database connection
async def get_db():
    if db_pool is None:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    async with db_pool.acquire() as connection:
        yield connection


# Pydantic Models
class OfferCreate(BaseModel):
    account_id: str
    offer_name: str
    discount: condecimal(ge=0, le=100, max_digits=5, decimal_places=2)
    recommendation_reason: str


class OfferUpdate(BaseModel):
    offer_name: Optional[str]
    discount: Optional[condecimal(ge=0, le=100, max_digits=5, decimal_places=2)]
    recommendation_reason: Optional[str]


# Fetch all offers for a specific customer (Employees: Admin & User)
@router.get("/offers/{account_id}", dependencies=[Depends(require_role(["Admin", "User"]))])
async def get_offers(account_id: str, db=Depends(get_db)):
    offers = await db.fetch(
        """
        SELECT offerid, accountid, offername, discount, recommendationreason, createdon
        FROM offers
        WHERE accountid = $1
        """, account_id
    )
    if not offers:
        raise HTTPException(status_code=204, detail="No offers found for this account")
    return [dict(offer) for offer in offers]


# Generate personalized offer (Improved Rule-Based System)
@router.get("/offers/generate/{account_id}", dependencies=[Depends(require_role(["Admin", "User"]))])
async def generate_offer(account_id: str, db=Depends(get_db)):
    """
    Generates an offer based on customer usage, purchases, and billing behavior.
    This is a rule-based system, which will later be replaced with an ML model.
    """
    customer_data = await db.fetchrow(
        """
        SELECT total_spent, overdue_payments, high_usage_category
        FROM customer_features WHERE accountid = $1
        """, account_id
    )

    if not customer_data:
        raise HTTPException(status_code=404, detail=f"No data found for account {account_id}")

    # Improved Rule-based offer generation
    high_spending_threshold = 1000
    overdue_threshold = 3
    medium_spender_threshold = 500

    if customer_data['high_usage_category'] == 'Mobile' and customer_data['total_spent'] > medium_spender_threshold:
        return {"offer": "50% Off on Next Mobile Plan", "reason": "High mobile data & spending detected."}

    if customer_data['overdue_payments'] > overdue_threshold:
        return {"offer": "5% Discount on Bills", "reason": "Frequent overdue payments detected."}

    if customer_data['total_spent'] > high_spending_threshold:
        return {"offer": "Exclusive VIP Plan Access", "reason": "High spending customer."}

    return {"offer": "10% Off on Next Purchase", "reason": "General customer engagement offer."}


# Create a new offer (Admin only)
@router.post("/offers", dependencies=[Depends(require_role("Admin"))])
async def create_offer(offer_data: OfferCreate, db=Depends(get_db)):
    offer = await db.fetchrow(
        """
        INSERT INTO offers (accountid, offername, discount, recommendationreason, createdon)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        """,
        offer_data.account_id, offer_data.offer_name, offer_data.discount,
        offer_data.recommendation_reason, datetime.utcnow()
    )
    return dict(offer)


# Update an existing offer (Admin only)
@router.put("/offers/{offer_id}", dependencies=[Depends(require_role("Admin"))])
async def update_offer(offer_id: int, offer_data: OfferUpdate, db=Depends(get_db)):
    existing_offer = await db.fetchrow("SELECT offerid FROM offers WHERE offerid = $1", offer_id)

    if not existing_offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    if not any([offer_data.offer_name, offer_data.discount, offer_data.recommendation_reason]):
        raise HTTPException(status_code=422, detail="No valid fields to update")

    await db.execute(
        """
        UPDATE offers 
        SET offername = COALESCE($1, offername),
            discount = COALESCE($2, discount),
            recommendationreason = COALESCE($3, recommendationreason)
        WHERE offerid = $4
        """,
        offer_data.offer_name, offer_data.discount, offer_data.recommendation_reason, offer_id
    )
    return {"message": "Offer updated successfully"}


# Delete an offer (Admin only)
@router.delete("/offers/{offer_id}", dependencies=[Depends(require_role("Admin"))])
async def delete_offer(offer_id: int, db=Depends(get_db)):
    existing_offer = await db.fetchrow("SELECT offerid FROM offers WHERE offerid = $1", offer_id)

    if not existing_offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    await db.execute("DELETE FROM offers WHERE offerid = $1", offer_id)
    return {"message": "Offer deleted successfully"}
