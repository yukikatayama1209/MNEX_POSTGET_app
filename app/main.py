from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import SessionLocal, engine
import os
from pathlib import Path
from datetime import date

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

# 画像保存先のパス設定
UPLOAD_DIR = Path("app/photo_data")

@app.post("/prices/", response_model=schemas.Price)
async def create_price(
    username: str = Form(...),
    product: str = Form(...),
    purchase_date: date = Form(...),
    shop_location: str = Form(...),
    comments: str = Form(...),
    product_photo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    product_photo_path = None
    if product_photo:
        product_photo_path = UPLOAD_DIR / "product" / product_photo.filename
        with open(product_photo_path, "wb") as buffer:
            buffer.write(await product_photo.read())
        product_photo_path = str(product_photo_path)
    price_data = {
        "username": username,
        "product": product,
        "purchase_date": purchase_date,
        "shop_location": shop_location,
        "comments": comments,
        "product_photo": product_photo_path,
    }
    return crud.create_price(db=db, price=schemas.PriceCreate(**price_data))

@app.post("/hobbys/", response_model=schemas.Hobby)
async def create_hobby(
    username: str = Form(...),
    product: str = Form(...),
    purchase_date: date = Form(...),
    shop_location: str = Form(...),
    comments: str = Form(...),
    hobby_photo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    hobby_photo_path = None
    if hobby_photo:
        hobby_photo_path = UPLOAD_DIR / "hobby" / hobby_photo.filename
        with open(hobby_photo_path, "wb") as buffer:
            buffer.write(await hobby_photo.read())
        hobby_photo_path = str(hobby_photo_path)
    hobby_data = {
        "username": username,
        "product": product,
        "purchase_date": purchase_date,
        "shop_location": shop_location,
        "comments": comments,
        "hobby_photo": hobby_photo_path,
        "good": 0
    }
    return crud.create_hobby(db=db, hobby=schemas.HobbyCreate(**hobby_data))

@app.get("/photos/{file_path:path}")
async def get_photo(file_path: str):
    return FileResponse(file_path)
