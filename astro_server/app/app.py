from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from app.database import connect_db, disconnect_db, get_db

# Importing routes
from app.routes import (
    auth_routes as auth,
    user_routes,
    employee_routes,
    customer_routes,
    billing_routes,
    purchases_routes,
    spotlight_routes,
    timeline_routes,
    orders_routes
)

# Lifespan event handler for database connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ensure the DB is connected when the app starts and disconnected on shutdown."""
    await connect_db()  # Connect to the database
    yield
    await disconnect_db()  # Disconnect on shutdown

# Initialize FastAPI app with lifespan handler
app = FastAPI(
    title="AstroTel API",
    description="Role-based authentication and management system",
    version="1.0.0",
    lifespan=lifespan  # Add lifespan handler to manage DB connection lifecycle
)

# Enable CORS for all domains or specify allowed origins
origins = [
    "*",  # This will allow all domains to make requests to the API.
    # You can replace "*" with specific domains like:
    # "http://localhost:3000", "https://example.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows requests from specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include route files
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/users", tags=["User Management"])
app.include_router(employee_routes.router, prefix="/employees", tags=["Employees"])
app.include_router(customer_routes.router, prefix="/customers", tags=["Customers"])
app.include_router(billing_routes.router, prefix="/billing", tags=["Billing"])
app.include_router(purchases_routes.router, prefix="/purchases", tags=["Purchases"])
app.include_router(spotlight_routes.router, prefix="/spotlight", tags=["Spotlight"])
app.include_router(timeline_routes.router, prefix="/timeline", tags=["Timeline"])
app.include_router(orders_routes.router, prefix="/orders", tags=["Orders"])

print(f'app.routes = {app.routes}')

# Root endpoint
@app.get("/", dependencies=[Depends(get_db)])
def read_root():
    return {"message": "Welcome to AstroTel API"}

# Run the application
if __name__ == "__main__":
    uvicorn.run("app.app:app", host="0.0.0.0", port=8000, reload=True)
