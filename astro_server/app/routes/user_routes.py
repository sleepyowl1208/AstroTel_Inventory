from fastapi import APIRouter, Depends, HTTPException, status
from asyncpg import Pool
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from app.utils import hash_password, require_role  # Fixed import paths
from app.database import get_db  # Fixed import paths

from typing import Literal

router = APIRouter()

# ✅ User Schema
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: Optional[Literal["Admin", "User"]] = None
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[Literal["Admin", "User"]] = None
    password: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

# ✅ Create a new user (Admins only)
@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Pool = Depends(get_db), _=Depends(require_role("Admin"))):
    # Check if email already exists
    existing_user = await db.fetchrow("SELECT id FROM employee WHERE email = $1", user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already in use")

    hashed_password = await hash_password(user.password)
    query = """
        INSERT INTO employee (name, email, role, password)
        VALUES ($1, $2, $3, $4) RETURNING id, name, email, role
    """
    created_user = await db.fetchrow(query, user.name, user.email, user.role, hashed_password)
    return UserResponse(**dict(created_user))

# ✅ Get all users (Admins only)
@router.get("/users", response_model=List[UserResponse])
async def get_users(db: Pool = Depends(get_db)):
    try:
        query = "SELECT * FROM employee ORDER BY id"
        users = await db.fetch(query)
        print(users)
        return [UserResponse(**dict(user)) for user in users]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

@router.get("/test")
async def test_route():
    query = "SELECT *  FROM employee"
    return {"message": "Test route works from user_routes!"}

# ✅ Get a specific user by ID (Admins only)
@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Pool = Depends(get_db), _=Depends(require_role("Admin"))):
    query = "SELECT id, name, email, role FROM employee WHERE id = $1"
    user = await db.fetchrow(query, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**dict(user))


# ✅ Update a user (Admins only)
@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, user_data: UserUpdate, db: Pool = Depends(get_db),
                      _=Depends(require_role("Admin"))):
    # Fetch existing user
    existing_user = await db.fetchrow("SELECT * FROM employee WHERE id = $1", user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_fields = {}
    if user_data.name:
        update_fields["name"] = user_data.name
    if user_data.email:
        # Check if the new email is already taken
        email_exists = await db.fetchrow("SELECT id FROM employee WHERE email = $1", user_data.email)
        if email_exists and email_exists['id'] != user_id:
            raise HTTPException(status_code=400, detail="Email already in use")
        update_fields["email"] = user_data.email
    if user_data.role:
        update_fields["role"] = user_data.role
    if user_data.password:
        update_fields["password"] = await hash_password(user_data.password)

    if not update_fields:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    set_clause = ", ".join(f"{key} = ${i + 1}" for i, key in enumerate(update_fields.keys()))
    values = list(update_fields.values()) + [user_id]

    query = f"UPDATE employee SET {set_clause} WHERE id = ${len(values)} RETURNING id, name, email, role"
    updated_user = await db.fetchrow(query, *values)
    return UserResponse(**dict(updated_user))


# ✅ Delete a user (Admins only)
@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Pool = Depends(get_db), _=Depends(require_role("Admin"))):
    query = "DELETE FROM employee WHERE id = $1 RETURNING id"
    deleted_user = await db.fetchrow(query, user_id)

    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}
