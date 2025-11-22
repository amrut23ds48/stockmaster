from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True)

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
