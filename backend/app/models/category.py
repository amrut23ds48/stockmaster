from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_primary=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
