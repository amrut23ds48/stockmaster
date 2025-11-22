from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base # Assuming Base is defined here

class Warehouse(Base):
    __tablename__ = "warehouse" 

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(50), nullable=True) 
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    city_code = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationship to Location model
    locations = relationship("Location", back_populates="warehouse", cascade="all, delete-orphan")


class Location(Base):
    __tablename__ = "location" 

    id = Column(Integer, primary_key=True, autoincrement=True)
    warehouse_id = Column(Integer, ForeignKey("warehouse.id"), nullable=False)
    name = Column(String(100), nullable=False) 
    type = Column(
        Enum("receiving", "rack", "staging", "dispatch", "damaged", name="location_type"),
        nullable=False
    )
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationship to the Warehouse model
    warehouse = relationship("Warehouse", back_populates="locations")