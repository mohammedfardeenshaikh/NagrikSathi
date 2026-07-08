import hashlib
from datetime import datetime, timedelta
from typing import Any, Union
import jwt
from passlib.context import CryptContext
import logging

logger = logging.getLogger(__name__)

# Fallback setup in case bcrypt has platform compilation issues
try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except Exception as e:
    logger.warning(f"Could not initialize CryptContext for bcrypt: {e}. Falling back to hashlib.sha256.")
    pwd_context = None

JWT_SECRET = "nagriksathi_secret_key_for_jwt_signing_dev"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    if pwd_context:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    # Secure fallback hashing
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if pwd_context:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            pass
    # Fallback verification
    return hash_password(plain_password) == hashed_password

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt
