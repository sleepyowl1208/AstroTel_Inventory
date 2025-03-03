from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
import asyncpg
from typing import List, Optional
from auth_routes import get_current_user, require_role
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

router = APIRouter()

# Database connection pool
db_pool: Optional[asyncpg.Pool] = None

async def get_db():
    """Establishes a connection with the database."""
    global db_pool
    if db_pool is None:
        db_pool = await asyncpg.create_pool(DATABASE_URL)
    async with db_pool.acquire() as connection:
        yield connection

# Pydantic Models for validation
class TicketCreate(BaseModel):
    account_id: str
    issue_type: str
    status: str = Field(..., pattern="^(Open|In Progress|Resolved|Closed)$")

class TicketUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(Open|In Progress|Resolved|Closed)$")
    issue_type: Optional[str]

# Fetch all tickets (Admin sees all, Users see only their tickets)
@router.get("/spotlight")
async def get_tickets(user=Depends(get_current_user), db=Depends(get_db)):
    if user["role"] == "Admin":
        query = """
            SELECT s.ticketid, s.accountid, c.customer_name, s.issuetype, s.status, s.createdat
            FROM spotlight s
            JOIN customers c ON s.accountid = c.accountid
            """
        tickets = await db.fetch(query)
    else:
        query = """
            SELECT s.ticketid, s.accountid, c.customer_name, s.issuetype, s.status, s.createdat
            FROM spotlight s
            JOIN customers c ON s.accountid = c.accountid
            WHERE s.accountid = $1
            """
        tickets = await db.fetch(query, user["account_id"])

    return [dict(ticket) for ticket in tickets]

# Fetch a specific ticket (Admin or ticket owner can access)
@router.get("/spotlight/{ticket_id}")
async def get_ticket(ticket_id: int, user=Depends(get_current_user), db=Depends(get_db)):
    query = """
        SELECT s.ticketid, s.accountid, c.customer_name, s.issuetype, s.status, s.createdat
        FROM spotlight s
        JOIN customers c ON s.accountid = c.accountid
        WHERE s.ticketid = $1
        """
    ticket = await db.fetchrow(query, ticket_id)

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if user["role"] != "Admin" and user["account_id"] != ticket["accountid"]:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    return dict(ticket)

# Create a new ticket
@router.post("/spotlight")
async def create_ticket(ticket_data: TicketCreate, user=Depends(get_current_user), db=Depends(get_db)):
    if user["role"] != "Admin" and user["account_id"] != ticket_data.account_id:
        raise HTTPException(status_code=403, detail="Unauthorized to create a ticket for this account")

    query = """
        INSERT INTO spotlight (accountid, issuetype, status, createdat)
        VALUES ($1, $2, $3, NOW())
        RETURNING ticketid
        """

    ticket_id = await db.fetchval(query, ticket_data.account_id, ticket_data.issue_type, ticket_data.status)

    return {"message": "Ticket created successfully", "ticket_id": ticket_id}

# Update ticket details (Admin or Ticket Owner)
@router.put("/spotlight/{ticket_id}")
async def update_ticket(ticket_id: int, ticket_data: TicketUpdate, user=Depends(get_current_user), db=Depends(get_db)):
    existing_ticket = await db.fetchrow("SELECT accountid FROM spotlight WHERE ticketid = $1", ticket_id)

    if not existing_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if user["role"] != "Admin" and user["account_id"] != existing_ticket["accountid"]:
        raise HTTPException(status_code=403, detail="Unauthorized to update this ticket")

    query = """
    UPDATE spotlight
    SET issuetype = COALESCE($1, issuetype), status = COALESCE($2, status)
    WHERE ticketid = $3
    """
    await db.execute(query, ticket_data.issue_type, ticket_data.status, ticket_id)

    return {"message": "Ticket updated successfully"}

# Delete a ticket (Admin only)
@router.delete("/spotlight/{ticket_id}", dependencies=[Depends(require_role("Admin"))])
async def delete_ticket(ticket_id: int, db=Depends(get_db)):
    existing_ticket = await db.fetchrow("SELECT ticketid FROM spotlight WHERE ticketid = $1", ticket_id)

    if not existing_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    await db.execute("DELETE FROM spotlight WHERE ticketid = $1", ticket_id)

    return {"message": "Ticket deleted successfully"}
