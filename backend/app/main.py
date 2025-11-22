from fastapi import FastAPI
from app.routers import auth, products, orders
from app.database import Base, engine

# Ensures SQLAlchemy models are imported before Alembic migration
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router) # pyright: ignore[reportGeneralTypeIssues]
