from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS設定
origins = [
    "http://localhost:3000",  # React開発サーバー
    # 他のオリジンを必要に応じて追加
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/prices/", response_model=schemas.Price)
def create_price(price: schemas.PriceCreate, db: Session = Depends(get_db)):
    return crud.create_price(db=db, price=price)

@app.post("/hobbys/", response_model=schemas.Hobby)
def create_hobby(hobby: schemas.HobbyCreate, db: Session = Depends(get_db)):
    return crud.create_hobby(db=db, hobby=hobby)

@app.get("/prices/", response_model=list[schemas.Price])
def read_prices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    prices = crud.get_prices(db, skip=skip, limit=limit)
    return prices
