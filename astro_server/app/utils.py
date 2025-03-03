import bcrypt
from functools import wraps
from fastapi import HTTPException, status
from typing import Callable
from fastapi.security import OAuth2PasswordBearer


# Hash password using bcrypt
async def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    """
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed  # Returning as bytes for direct comparison later


# Require a specific role to access a route
def require_role(required_role: str):
    """
    Decorator to enforce role-based access control.
    """

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract the current user from the dependencies or kwargs
            user = kwargs.get('user')  # Adjust this to match your FastAPI user dependency setup

            if not user:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

            # Check if user has the required role
            if user.get('role') != required_role:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

            return await func(*args, **kwargs)

        return wrapper

    return decorator
