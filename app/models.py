from sqlalchemy import Column, Integer, String, Date, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Price(Base):
    __tablename__ = 'prices'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(255), nullable=False)
    product = Column(String(255), nullable=False)
    purchase_date = Column(Date, nullable=False)
    shop_location = Column(String(255), nullable=False)
    product_photo = Column(Text, nullable=False)
    comments = Column(Text)
