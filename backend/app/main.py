from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.db import engine, Base, SessionLocal
from backend.app.api.api import api_router
from backend.app.models.user import User
from backend.app.models.category import Category, SubCategory
from backend.app.models.mp_settings import MPSettings
from sqlalchemy import text
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Automatically create tables in database (MySQL or SQLite fallback) on startup
try:
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
    
    # Run Seeding
    db = SessionLocal()
    try:
        # Check if default user exists
        user = db.query(User).filter(User.email == "citizen@nagriksathi.in").first()
        if not user:
            logger.info("Seeding default user...")
            user = User(
                name="Nagrik Citizen",
                email="citizen@nagriksathi.in",
                password_hash="pbkdf2_sha256_mocked_for_dev_purposes_only",
                phone="+91 9999999999"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"Seeded user: {user.name} (ID: {user.id})")
            
        # Check if categories exist
        if db.query(Category).count() == 0:
            logger.info("Seeding default categories and subcategories...")
            seed_data = {
                "Sanitation": {
                    "desc": "Sewage, garbage dump, public hygiene",
                    "subs": ["Garbage Accumulation", "Clogged Drain", "Public Toilet Cleaning"]
                },
                "Water Supply": {
                    "desc": "Leaking pipes, contaminated water supply, low water pressure",
                    "subs": ["Pipeline Burst", "Dirty Water Supply", "Water Tanker Request"]
                },
                "Public Safety": {
                    "desc": "Street light out, traffic hazards, dark lanes",
                    "subs": ["Broken Streetlight", "Dark Alley Warning", "Stray Animals Hazard"]
                },
                "Road Infrastructure": {
                    "desc": "Potholes, broken roads, pavement repairs",
                    "subs": ["Pothole Cluster", "Caved-in Road", "Broken Footpath"]
                }
            }
            for cat_name, data in seed_data.items():
                cat = Category(name=cat_name, description=data["desc"])
                db.add(cat)
                db.commit()
                db.refresh(cat)
                for sub_name in data["subs"]:
                    sub = SubCategory(category_id=cat.id, name=sub_name, description=f"{sub_name} issues")
                    db.add(sub)
                db.commit()
            logger.info("Database categories seeding completed.")
    except Exception as seed_err:
        logger.error(f"Error seeding database: {seed_err}")
        db.rollback()
    finally:
        db.close()
except Exception as e:
    logger.error(f"Error initializing database tables: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configurations
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include main router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Basic health-check endpoint that verifies DB connectivity
@app.get("/health", tags=["Health"])
def health_check():
    db_status = "Down"
    error_message = None
    try:
        # Executing a lightweight test query
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        db_status = "Up"
    except Exception as e:
        error_message = str(e)
    
    return {
        "status": "healthy" if db_status == "Up" else "degraded",
        "database": db_status,
        "detail": error_message
    }

# Entrypoint test endpoint
@app.get("/", tags=["Index"])
def root():
    return {"message": f"Welcome to the {settings.PROJECT_NAME}!"}
