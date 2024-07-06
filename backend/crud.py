from sqlalchemy.orm import Session
from . import models, schemas
from typing import List

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_price(db: Session, price: schemas.PriceCreate):
    db_price = models.Price(**price.model_dump())
    db.add(db_price)
    db.commit()
    db.refresh(db_price)
    return db_price


def create_hobby(db: Session, hobby: schemas.HobbyCreate):
    db_hobby = models.Hobby(**hobby.dict())
    db.add(db_hobby)
    db.commit()
    db.refresh(db_hobby)
    return db_hobby


def get_prices(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Price).offset(skip).limit(limit).all()

def get_price(db: Session, price_id: int):
    return db.query(models.Price).filter(models.Price.id == price_id).first()


def get_hobby(db: Session, hobby_id: int):
    return db.query(models.Hobby).filter(models.Hobby.id == hobby_id).first()

def create_hobby(db: Session, hobby: schemas.HobbyCreate):
    db_hobby = models.Hobby(
        username=hobby.username,
        product=hobby.product,
        purchase_date=hobby.purchase_date,
        shop_location=hobby.shop_location,
        comments=hobby.comments,
        hobby_photo=hobby.hobby_photo,
        good=hobby.good,
    )
    db.add(db_hobby)
    db.commit()
    db.refresh(db_hobby)
    return db_hobby

def get_latest_hobbys(db: Session, limit: int):
    return db.query(models.Hobby).order_by(models.Hobby.purchase_date.desc()).limit(limit).all()

def get_top_hobbys(db: Session, limit: int):
    return db.query(models.Hobby).order_by(models.Hobby.good.desc()).limit(limit).all()
