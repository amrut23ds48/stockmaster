from sqlalchemy import Column, Integer, ForeignKey, Enum, Numeric, DateTime
from sqlalchemy.sql import func
from app.database import Base

class MovementLog(Base):
    __tablename__ = "movement_logs"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))

    change_type = Column(
        Enum("receipt","delivery","transfer","adjustment", name="movement_type")
    )

    change_qty = Column(Numeric(12, 2))
    reference_id = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())
