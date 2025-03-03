from fastapi import APIRouter, Depends, HTTPException, status
from asyncpg import Pool
from asyncpg.exceptions import UniqueViolationError
from pydantic import BaseModel, EmailStr
from typing import List, Literal
import random

from app.database import get_db

router = APIRouter()

# Pydantic Models
class Customer(BaseModel):
    accountid: str
    accounttype: Literal["Residential", "Business"]
    name: str
    email: EmailStr
    mainphone: str
    country: str
    pricelist: Literal["Basic", "Standard", "Premium", "Enterprise"]

class CustomerCreate(BaseModel):
    accounttype: Literal["Residential", "Business"]
    name: str
    email: EmailStr
    main_phone: str
    country: str
    pricelist: Literal["Basic", "Standard", "Premium", "Enterprise"]

# Function to generate account_id in "Astro-XXXXX" format
def generate_account_id():
    return f"Astro-{random.randint(100000, 999999)}"

# Create a new customer
@router.post("/customers", response_model=Customer, status_code=status.HTTP_201_CREATED)
async def create_customer(customer: CustomerCreate, db: Pool = Depends(get_db)):
    query = """
        INSERT INTO customers (account_id, account_type, name, email, main_phone, country, price_list)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING account_id, account_type, name, email, main_phone, country, price_list
    """
    try:
        new_customer = await db.fetchrow(
            query,
            generate_account_id(), customer.account_type, customer.name, customer.email,
            customer.main_phone, customer.country, customer.price_list
        )
        return Customer(**dict(new_customer))
    except UniqueViolationError:
        raise HTTPException(status_code=400, detail="Email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Get all customers
@router.get("/customers", response_model=List[Customer])
async def get_customers(db: Pool = Depends(get_db)):
    try:
        query = "SELECT * FROM customers"
        customers = await db.fetch("SELECT * FROM customers")
        return [Customer(**dict(customer)) for customer in customers]  # Returns empty list if no data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

@router.get("/test_connection")
async def test_connection(db: Pool = Depends(get_db)):
    try:
        # Simple query to check the database connection
        result = await db.fetch("SELECT * FROM customers")
        return {"message": "Inside customers test connection", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

# Get a specific customer by ID
@router.get("/customers/{accountid}", response_model=Customer)
async def get_customer(accountid: str, db: Pool = Depends(get_db)):
    try:
        query = "SELECT * FROM customers WHERE accountid = $1"
        customer = await db.fetchrow(query, accountid)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found. Enter correct AccountID which looks like 'Astro-120892'")
        return Customer(**dict(customer))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

# Update a customer
@router.put("/customers/{accountid}", response_model=Customer)
async def update_customer(account_id: str, customer_data: CustomerCreate, db: Pool = Depends(get_db)):
    # Check if customer exists
    check_query = "SELECT * FROM customers WHERE account_id = $1"
    existing_customer = await db.fetchrow(check_query, account_id)
    if not existing_customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Prevent unnecessary updates
    if all(
        getattr(existing_customer, field) == getattr(customer_data, field)
        for field in customer_data.model_dump()
    ):
        raise HTTPException(status_code=400, detail="No changes detected")

    # Perform update
    query = """
        UPDATE customers SET account_type = $1, name = $2, email = $3, main_phone = $4, country = $5, price_list = $6
        WHERE account_id = $7
        RETURNING account_id, account_type, name, email, main_phone, country, price_list
    """
    updated_customer = await db.fetchrow(
        query,
        customer_data.account_type, customer_data.name, customer_data.email,
        customer_data.main_phone, customer_data.country, customer_data.price_list,
        account_id
    )
    return Customer(**dict(updated_customer))

# Delete a customer
@router.delete("/customers/{accountid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(accountid: str, db: Pool = Depends(get_db)):
    try:
        query = "DELETE FROM customers WHERE accountid = $1 RETURNING accountid"
        deleted_customer = await db.fetchrow(query, accountid)
        return {"message": f"User ${query} deleted successfully"}
    except Exception as e:
        if not deleted_customer:
            raise HTTPException(status_code=404, detail="Customer not found")
