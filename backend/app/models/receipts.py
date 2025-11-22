<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, Enum, DateTime
=======
from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Numeric
>>>>>>> f5d6ae10654d5e7bf3361ab5f59b0ff2b21050dd
from sqlalchemy.sql import func
from app.database import Base

class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True)
<<<<<<< HEAD

    reference = Column(String(255), nullable=False)
    from_location = Column(String(255), nullable=False)
    to_location = Column(String(255), nullable=False)

    contact = Column(String(255), nullable=True)

    schedule_date = Column(DateTime, nullable=True)

    status = Column(
        Enum("ready", "not_ready", name="receipt_status"),
        default="not_ready",
        nullable=False
    )

    created_at = Column(DateTime, server_default=func.now())
=======
    supplier = Column(String(255))
    status = Column(
        Enum("draft", "waiting", "done", "canceled", name="receipt_status"),
        default="draft"
    )
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())


class ReceiptItem(Base):
    __tablename__ = "receipt_items"

    id = Column(Integer, primary_key=True)
    receipt_id = Column(Integer, ForeignKey("receipts.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Numeric(12, 2), nullable=False)
>>>>>>> f5d6ae10654d5e7bf3361ab5f59b0ff2b21050dd
