from fastapi import APIRouter, Depends, HTTPException, FastAPI
import asyncpg
from typing import List, Optional
from pydantic import BaseModel, Field
from auth_routes import require_role
from dotenv import load_dotenv
import os
from datetime import datetime
from enum import Enum
import logging

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

router = APIRouter()

# Logging setup
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# Database connection pool
db_pool: Optional[asyncpg.Pool] = None

async def init_db():
    global db_pool
    if db_pool is None:
        db_pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=10)

async def close_db():
    global db_pool
    if db_pool:
        await db_pool.close()
        db_pool = None

async def get_db():
    global db_pool
    if db_pool is None:
        await init_db()  # Reinitialize if closed unexpectedly
    async with db_pool.acquire() as connection:
        yield connection

# FastAPI app lifecycle events
app = FastAPI()

@app.on_event("startup")
async def startup():
    await init_db()

@app.on_event("shutdown")
async def shutdown():
    await close_db()

# Pydantic Enum for Icons
class IconEnum(str, Enum):
    ALERT = "⚠️"
    INFO = "ℹ️"
    SUCCESS = "✅"
    ERROR = "❌"

# Pydantic Model
class TimelineEntry(BaseModel):
    account_id: str = Field(..., min_length=1, max_length=50)
    title: str = Field(..., min_length=1, max_length=255)
    icon: IconEnum
    event_date: datetime

# Fetch timeline events for a specific customer (Admins & Users)
@router.get("/timeline/{account_id}", dependencies=[Depends(require_role(["Admin", "User"]))])
async def get_timeline(account_id: str, db=Depends(get_db)):
    try:
        events = await db.fetch(
            """
            SELECT eventid, accountid, title, icon, eventdate
            FROM timeline
            WHERE accountid = $1
            ORDER BY eventdate DESC
            """, account_id
        )
        if not events:
            raise HTTPException(status_code=404, detail="No timeline events found for this account")
        return {"status": "success", "data": [dict(event) for event in events]}
    except Exception as e:
        logger.error(f"Database error in get_timeline: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Create a new timeline entry (Admin only)
@router.post("/timeline", dependencies=[Depends(require_role("Admin"))])
async def create_timeline_entry(entry: TimelineEntry, db=Depends(get_db)):
    try:
        event = await db.fetchrow(
            """
            INSERT INTO timeline (accountid, title, icon, eventdate)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            """,
            entry.account_id, entry.title, entry.icon.value, entry.event_date
        )
        return {"status": "success", "data": dict(event)}
    except Exception as e:
        logger.error(f"Error inserting timeline entry: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Delete a timeline entry (Admin only)
@router.delete("/timeline/{event_id}", dependencies=[Depends(require_role("Admin"))])
async def delete_timeline_entry(event_id: int, db=Depends(get_db)):
    try:
        deleted_event = await db.fetchrow("DELETE FROM timeline WHERE eventid = $1 RETURNING *", event_id)
        if not deleted_event:
            raise HTTPException(status_code=404, detail="Event not found")
        return {"status": "success", "message": "Timeline event deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting timeline entry: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
