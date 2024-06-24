from pydantic import BaseModel
from datetime import date

class PriceBase(BaseModel):
    username: str
    product: str
    purchase_date: date
    shop_location: str
    product_photo: str
    comments: str | None = None

class PriceCreate(PriceBase):
    pass

class Price(PriceBase):
    id: int

    class Config:
        orm_mode = True
