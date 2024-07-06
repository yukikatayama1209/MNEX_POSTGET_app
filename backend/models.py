from sqlalchemy import Column, Integer, String, Date, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    point = Column(Integer, default=0)


class Price(Base):
    __tablename__ = 'prices'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), nullable=False)
    product = Column(String(255), nullable=False)
    purchase_date = Column(Date, nullable=False)
    shop_location = Column(String(255), nullable=False)
    product_photo = Column(Text, nullable=False)
    comments = Column(Text)

class Hobby(Base):
    __tablename__ = 'hobbys'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), nullable=False)
    product = Column(String(255), nullable=False)
    purchase_date = Column(Date, nullable=False)
    shop_location = Column(String(255), nullable=False)
    hobby_photo = Column(Text, nullable=False)
    comments = Column(Text)
    good = Column(Integer, default=0)
