from fastapi import APIRouter, Depends, HTTPException, status
from asyncpg import Pool
from pydantic import BaseModel
from typing import List
from datetime import date
from app.auth import require_role
from app.database import get_db

router = APIRouter()

# Offer Schema
class Offer(BaseModel):
    id: int
    account_id: int
    offer_name: str
    description: str
    discount: float
    valid_until: date

class OfferCreate(BaseModel):
    account_id: int
    offer_name: str
    description: str
    discount: float
    valid_until: date  # Changed from str to date for better validation

# Create a new offer (Admins only)
@router.post("/offers", response_model=Offer, status_code=status.HTTP_201_CREATED)
async def create_offer(offer: OfferCreate, db: Pool = Depends(get_db), _=Depends(require_role("Admin"))):
    query = """
        INSERT INTO offers (account_id, offer_name, description, discount, valid_until)
        VALUES ($1, $2, $3, $4, $5) RETURNING id, account_id, offer_name, description, discount, valid_until
    """
    try:
        created_offer = await db.fetchrow(query, offer.account_id, offer.offer_name, offer.description, offer.discount, offer.valid_until)
        if not created_offer:
            raise HTTPException(status_code=500, detail="Failed to create offer")
        return Offer(**dict(created_offer))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Get all offers (Admins and Users)
@router.get("/offers", response_model=List[Offer])
async def get_offers(db: Pool = Depends(get_db), _=Depends(require_role("User"))):
    query = "SELECT id, account_id, offer_name, description, discount, valid_until FROM offers"
    offers = await db.fetch(query)
    if not offers:
        raise HTTPException(status_code=404, detail="No offers found")  # Handling empty list case
    return [Offer(**dict(offer)) for offer in offers]

# Get a specific offer by ID (Admins and Users)
@router.get("/offers/{offer_id}", response_model=Offer)
async def get_offer(offer_id: int, db: Pool = Depends(get_db), _=Depends(require_role("User"))):
    query = "SELECT id, account_id, offer_name, description, discount, valid_until FROM offers WHERE id = $1"
    offer = await db.fetchrow(query, offer_id)
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return Offer(**dict(offer))

# Update an offer (Admins only)
@router.put("/offers/{offer_id}", response_model=Offer)
async def update_offer(offer_id: int, offer_data: OfferCreate, db: Pool = Depends(get_db), _=Depends(require_role("Admin"))):
    query = """
        UPDATE offers SET account_id = $1, offer_name = $2, description = $3, discount = $4, valid_until = $5
        WHERE id = $6 RETURNING id, account_id, offer_name, description, discount, valid_until
    """
    try:
        updated_offer = await db.fetchrow(query, offer_data.account_id, offer_data.offer_name, offer_data.description, offer_data.discount, offer_data.valid_until, offer_id)
        if not updated_offer:
            raise HTTPException(status_code=404, detail="Offer not found or update failed")
        return Offer(**dict(updated_offer))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Delete an offer (Admins only)
@router.delete("/offers/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_offer(offer_id: int, db: Pool = Depends(get_db), _=Depends(require_role("Admin"))):
    query = "DELETE FROM offers WHERE id = $1 RETURNING id"
    try:
        deleted_offer = await db.fetchrow(query, offer_id)
        if not deleted_offer:
            raise HTTPException(status_code=404, detail="Offer not found")
        return {"message": "Offer deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
