
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    sku = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    category_id = Column(Integer, ForeignKey("categories.id"))
    unit = Column(String(50), default="unit")
    created_at = Column(DateTime, server_default=func.now())
