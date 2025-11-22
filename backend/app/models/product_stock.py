from sqlalchemy import Column, Integer, Numeric, ForeignKey, UniqueConstraint
from app.database import Base

class ProductStock(Base):
    __tablename__ = "product_stock"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    quantity = Column(Numeric(12, 2), default=0)

    __table_args__ = (
        UniqueConstraint("product_id", "warehouse_id", name="uq_product_warehouse"),
    )
