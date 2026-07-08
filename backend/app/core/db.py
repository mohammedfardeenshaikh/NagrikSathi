from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Fallback to SQLite if MySQL connection fails
try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_recycle=3600,
        pool_pre_ping=True
    )
    # Verify connection
    with engine.connect() as conn:
        logger.info("Successfully connected to MySQL database.")
except Exception as e:
    logger.warning(f"Failed to connect to MySQL database at {settings.MYSQL_SERVER}. Falling back to SQLite local database.")
    # SQLite fallback
    engine = create_engine(
        "sqlite:///./nagriksathi.db",
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Database session dependency to be used in routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
