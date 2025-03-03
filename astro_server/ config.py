import os
from dotenv import load_dotenv
# Load environment variables from .env
load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL")
print(f'DATABASE_URL is {DATABASE_URL}')

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
