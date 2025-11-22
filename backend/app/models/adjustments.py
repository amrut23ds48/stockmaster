from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, Numeric
from sqlalchemy.sql import func
from app.database import Base

class Adjustment(Base):
    __tablename__ = "adjustments"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))
    previous_qty = Column(Numeric(12, 2))
    new_qty = Column(Numeric(12, 2))
    reason = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())
