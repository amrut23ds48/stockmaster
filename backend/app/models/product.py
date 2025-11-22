from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from app.database import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    owner_id = Column(Integer, nullable=True)  # optional: link to user if needed
