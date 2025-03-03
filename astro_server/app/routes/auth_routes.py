# Handles login, logout, JWT
from datetime import datetime, timedelta, UTC
import jwt
import asyncpg
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from dotenv import load_dotenv

import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

#from astro_sever.config import SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# Load environment variables from .env file
load_dotenv()

# Get values from .env
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Function to create a database connection
async def get_db():
    return await asyncpg.connect(DATABASE_URL)

# Hash password before storing in DB
def hash_password(password: str):
    return pwd_context.hash(password)

# Verify password during login
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Create JWT Token
def create_access_token(data: dict):
    """Generates a JWT token with expiration"""
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encode_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)
    print(f'encode_jwt = {encode_jwt}')
    return jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)

# **Decode JWT Token and Extract User Role**
def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return {"email": payload["sub"], "role": payload["role"], "name": payload["name"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# **Dependency to Get Current User**
async def get_current_user(token: str = Depends(oauth2_scheme)):
    return decode_token(token)

# **Dependency to Check User Role**
def require_role(required_role: str):
    def role_dependency(user: dict = Depends(get_current_user)):
        if user["role"] != required_role:
            raise HTTPException(status_code=403,  detail="Access forbidden: Insufficient permissions")
        return user
    return role_dependency

# **Login Route with Role-Based Token**
@router.post("/login")
#Flask native equivalent : @app.route("/login", methods=["POST"])
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Authenticate user against the employees table"""
    db = await get_db()

    # Fetch user from database
    query = "SELECT name, email, password_hash, role FROM employees WHERE email = $1"
    #$1 is replaced by the actual email before execution.
    user = await db.fetchrow(query, form_data.username)

    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    #Extract first name
    first_name = user["name"].split()[0]

    # Create JWT token with user role
    token = create_access_token({
        "sub": user["email"],
        "role": user["role"],
        "name": first_name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "message": f"Welcome back {first_name}!. You are successfully logged in. 😊"
    }

# **Logout Route**
@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully. Have a good day ☺️"}

# **Protected Route (Admin Only)**
@router.get("/admin-dashboard", dependencies=[Depends(require_role("Admin"))])
async def admin_dashboard(user: dict=Depends(get_current_user)):
    return {"message": f"Welcome, {user['name']}!", "role": "Admin"}

# **Protected Route (User Only)**
@router.get("/user-dashboard", dependencies=[Depends(require_role("User"))])
async def user_dashboard(user: dict = Depends(get_current_user)):
    return {"message": f"Welcome, {user['name']}!", "role": "User"}














