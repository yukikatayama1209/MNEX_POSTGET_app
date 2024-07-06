from sqlalchemy import Column, Integer, String, Date, Text
from .database import Base  # 相対インポートで .database を使用

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    point = Column(Integer, default=0)

class Price(Base):
    __tablename__ = "prices"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    product = Column(String, nullable=False)
    purchase_date = Column(Date, nullable=False)
    shop_location = Column(String, nullable=False)
    product_photo = Column(Text, nullable=False)
    comments = Column(Text, nullable=True)

class Hobby(Base):
    __tablename__ = "hobbys"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    product = Column(String, index=True)
    purchase_date = Column(Date)
    shop_location = Column(String)
    comments = Column(String)
    hobby_photo = Column(String)
    good = Column(Integer, default=0)
