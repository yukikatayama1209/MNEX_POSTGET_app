from pydantic import BaseModel
from typing import Optional
from datetime import date

class PriceBase(BaseModel):
    product: str
    purchase_date: str
    shop_location: str
    comments: str
    product_photo: Optional[str] = None
    price: int
    importance: bool = False

class PriceCreate(PriceBase):
    username: str

class Price(PriceBase):
    id: int
    username: str

    class Config:
        from_attributes = True


class PriceResponse(BaseModel):
    product_photo: str
    purchase_date: date
    shop_location: str
    comments: Optional[str]
    price: int
    importance: bool
    class Config:
        orm_mode = True

    class Config:
        orm_mode = True

class HobbyBase(BaseModel):
    product: str
    purchase_date: str
    shop_location: str
    comments: str

class HobbyCreate(HobbyBase):
    username: str
    hobby_photo: Optional[str] = None
    good: int

class Hobby(HobbyBase):
    id: int
    

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    point: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str
    password: str

class PointUpdate(BaseModel):
    point: int
    username: str
