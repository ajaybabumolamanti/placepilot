import os
import time
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "placementpilot.db")
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

# Fix for PostgreSQL URL dialect compatibility (Render/Heroku/Railway supply postgres://)
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configure production-grade connection pooling
is_sqlite = "sqlite" in SQLALCHEMY_DATABASE_URL

if is_sqlite:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # Production PostgreSQL with keep-alive, pre-ping validation, and connection recycling
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_timeout=30,
        pool_recycle=300,  # Recycle connections every 5 minutes to prevent stale dropped sockets
        pool_pre_ping=True  # Test connection liveliness before checkout to prevent dead SSL/socket crashes
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_db_health() -> dict:
    """Performs a lightweight ping against the database to confirm health."""
    start_time = time.time()
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        latency_ms = round((time.time() - start_time) * 1000, 2)
        return {
            "status": "connected",
            "dialect": engine.dialect.name,
            "latency_ms": latency_ms
        }
    except Exception as e:
        return {
            "status": "disconnected",
            "error": str(e)
        }
