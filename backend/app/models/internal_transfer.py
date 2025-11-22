from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Numeric
from sqlalchemy.sql import func
from app.database import Base

class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True)
    customer = Column(String(255))
    status = Column(
        Enum("draft", "waiting", "done", "canceled", name="delivery_status"),
        default="draft"
    )
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())


class DeliveryItem(Base):
    __tablename__ = "delivery_items"

    id = Column(Integer, primary_key=True)
    delivery_id = Column(Integer, ForeignKey("deliveries.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Numeric(12, 2), nullable=False)
