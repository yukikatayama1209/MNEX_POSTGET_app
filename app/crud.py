from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas

def get_prices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Price).offset(skip).limit(limit).all()

def create_price(db: Session, price: schemas.PriceCreate):
    db_price = models.Price(**price.dict())
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

def get_latest_hobby(db: Session):
    return db.query(models.Hobby).order_by(desc(models.Hobby.id)).first()

def increment_good(db: Session, hobby_id: int):
    hobby = db.query(models.Hobby).filter(models.Hobby.id == hobby_id).first()
    if hobby:
        hobby.good += 1
        db.commit()
        db.refresh(hobby)
        return hobby
    return None

def signin_as_users()