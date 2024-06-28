from pydantic import BaseModel
from datetime import date

class UserBase(BaseModel):
    username: str
    password: str
    point: int

class User(UserBase):
    id: int
class UserCreate(UserBase):
    pass
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

class HobbyBase(BaseModel):
    username: str
    product: str
    purchase_date: date
    shop_location: str
    hobby_photo: str
    comments: str | None = None
    good: int = 0

class HobbyCreate(HobbyBase):
    pass

class Hobby(HobbyBase):
    id: int

    class Config:
        orm_mode = True
