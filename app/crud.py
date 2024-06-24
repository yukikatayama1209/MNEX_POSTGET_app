from sqlalchemy.orm import Session
from . import models, schemas

def get_prices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Price).offset(skip).limit(limit).all()

def create_price(db: Session, price: schemas.PriceCreate):
    db_price = models.Price(**price.dict())
    db.add(db_price)
    db.commit()
    db.refresh(db_price)
    return db_price

