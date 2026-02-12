import os
from dotenv import load_dotenv
load_dotenv()

DB_CONFIG = {
    "host": os.environ.get("DB_HOST"),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "database": os.environ.get("DB_NAME")
}

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
