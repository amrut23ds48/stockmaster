from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Stock(Base):
    __tablename__ = "stock"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Product identification (using SKU as per your schema)
    sku = Column(String(100), nullable=False) 
    
    # Link to Location model
    location_id = Column(Integer, ForeignKey("location.id"), nullable=False)
    
    quantity = Column(Integer, nullable=False)
    
    # Additional Denormalized Data (as per your schema)
    category = Column(String(100), nullable=True) 
    company_name = Column(String(100), nullable=True)

    # Relationships (Assumes Location model is defined and imported)
    location = relationship("Location")