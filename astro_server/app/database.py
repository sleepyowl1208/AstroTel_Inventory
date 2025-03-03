from fastapi import HTTPException
from asyncpg import Pool, create_pool
from fastapi import Depends
from typing import AsyncGenerator, Any
import logging

DATABASE_URL = "postgresql://postgres:Krishna%4012@localhost:5433/AstroTel"

# Global variable for the connection pool
db_pool: Pool = None


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the connection pool (called in startup)
async def init_db():
    """Create and initialize the database connection pool."""
    global db_pool
    if db_pool is None:
        db_pool = await create_pool(DATABASE_URL)
        print("Database pool initialized:", db_pool)
        logger.info("Database connection pool initialized successfully!")
    else:
        logger.info("Database connection pool already initialized.")


# Dependency to get DB connection
async def get_db() -> AsyncGenerator[Any, Any]:
    """Get a database connection from the pool."""
    if db_pool is None:
        raise HTTPException(status_code=500, detail="Database connection pool not initialized")

    try:
        # Acquire a connection from the pool
        async with db_pool.acquire() as connection:
            yield connection
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# Ensure the database is connected at application startup
async def connect_db():
    """Make sure the database connection pool is initialized."""
    await init_db()


# Ensure the database connection is closed when the app shuts down
async def disconnect_db():
    """Close the database connection pool."""
    global db_pool
    if db_pool:
        await db_pool.close()
        db_pool = None
        print("Database pool closed.")
