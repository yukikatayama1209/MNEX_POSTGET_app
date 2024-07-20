import sys
import os
import uuid

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
import shutil
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import desc
from starlette.middleware.sessions import SessionMiddleware as StarletteSessionMiddleware
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Dict, Any
import plotly.graph_objects as go

from .database import SessionLocal, engine
from . import models, schemas, crud
from .models import User, DataTable
from backend.schemas import PointUpdate

# セキュリティ設定
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# データベースの初期化
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# セッションミドルウェアの追加（Starletteを使用）
app.add_middleware(StarletteSessionMiddleware, secret_key="your_secret_key")

# 静的ファイルの設定
app.mount("/photo_data", StaticFiles(directory="backend/photo_data"), name="photo_data")

# CORSミドルウェアの設定
origins = [
    "http://localhost:5500",  # フロントエンドが動作しているURL
    "http://localhost:8000",  # 必要に応じて追加
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのHTTPヘッダーを許可
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(db, username: str):
    return crud.get_user_by_username(db, username)

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=schemas.User)
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    return crud.create_user(db=db, user=user, hashed_password=hashed_password)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    print(f"Token received: {token}")  # トークンのログ
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Decoded payload: {payload}")  # ペイロードのログ
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        print(f"Username from payload: {username}")  # ユーザー名のログ
    except JWTError as e:
        print(f"JWTError: {e}")  # エラーログ
        raise credentials_exception
    user = crud.get_user_by_username(db, username=username)
    if user is None:
        print("User not found")  # ユーザーが見つからない場合のログ
        raise credentials_exception
    print(f"Authenticated user: {user.username}")  # 認証されたユーザーのログ
    return user

@app.post("/prices/")
async def create_price(
    product: str = Form(...),
    purchase_date: str = Form(...),
    shop_location: str = Form(...),
    price: int = Form(...),
    importance: bool = Form(...),
    comments: str = Form(...),
    product_photo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    print(f"Authenticated user: {current_user.username}")

    allowed_users = ["yuka", "moderator"]
    
    if current_user.username not in allowed_users and importance:
        importance = False
    
    product_photo_path = None
    if product_photo:
        product_photo_path = f"backend/photo_data/product/{product_photo.filename}"
        os.makedirs(os.path.dirname(product_photo_path), exist_ok=True)
        with open(product_photo_path, "wb") as buffer:
            shutil.copyfileobj(product_photo.file, buffer)
        print(f"Product photo path: {product_photo_path}")

    price_data = {
        "username": current_user.username,
        "product": product,
        "purchase_date": purchase_date,
        "shop_location": shop_location,
        "price": price,
        "importance": importance,
        "comments": comments,
        "product_photo": product_photo_path
    }

    print(f"Price data to be inserted: {price_data}")

    new_price = crud.create_price(db=db, price=schemas.PriceCreate(**price_data))
    print(f"New price inserted: {new_price.id}")
    
    await update_user_point(schemas.PointUpdate(username=current_user.username, point=50), db)
    print(f"User points updated: {current_user.username}")

    return {"price_id": new_price.id, "message": "Price created successfully"}



@app.post("/hobbys/")
async def create_hobby(
    price_id: int = Form(...),
    comments: str = Form(...),
    hobby_photo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    print(f"Authenticated user: {current_user.username}")

    price = crud.get_price(db, price_id=price_id)
    if not price:
        return {"error": "Price data not found"}, 400

    hobby_photo_path = None
    if hobby_photo:
        hobby_photo_path = f"backend/photo_data/hobby/{hobby_photo.filename}"
        os.makedirs(os.path.dirname(hobby_photo_path), exist_ok=True)
        with open(hobby_photo_path, "wb") as buffer:
            shutil.copyfileobj(hobby_photo.file, buffer)
        print(f"Hobby photo path: {hobby_photo_path}")

    hobby_data = {
        "username": current_user.username,
        "product": price.product,
        "purchase_date": price.purchase_date.isoformat(),  # 文字列に変換
        "shop_location": price.shop_location,
        "comments": comments,
        "hobby_photo": hobby_photo_path,
        "good": 0
    }

    print(f"Hobby data to be inserted: {hobby_data}")

    new_hobby = crud.create_hobby(db=db, hobby=schemas.HobbyCreate(**hobby_data))
    print(f"New hobby inserted: {new_hobby}")

    await update_user_point(schemas.PointUpdate(username=current_user.username, point=10), db)
    print(f"User points updated: {current_user.username}")

    return {"message": "Hobby created successfully", "hobby": new_hobby}


@app.post("/users/update_point")
async def update_user_point(
    point_update: schemas.PointUpdate,
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_username(db, username=point_update.username)
    if user:
        user.point += point_update.point
        db.commit()
        db.refresh(user)
        print(f"User points after update: {user.point}")
        return {"message": "User points updated successfully", "points": user.point}
    print("User not found for updating points")
    raise HTTPException(status_code=404, detail="User not found")

@app.get("/price_data/{product}", response_model=List[schemas.PriceResponse])
def read_price_data(product: str, db: Session = Depends(get_db)):
    prices = crud.get_prices_by_product(db, product=product)
    if not prices:
        raise HTTPException(status_code=404, detail=f"No price data found for {product}")
    print(f"Returning price data: {prices}")  # デバッグ用のプリント文を追加
    return prices



@app.get("/hobbys/latest", response_model=List[Dict[str, Any]])
def read_latest_hobbys(db: Session = Depends(get_db)):
    hobbys = crud.get_latest_hobbys(db, limit=5)
    print(f"Latest Hobbys: {hobbys}")  # デバッグ用
    response = []
    for hobby in hobbys:
        hobby_data = {
            "id": hobby.id,
            "username": hobby.username,
            "product": hobby.product,
            "purchase_date": hobby.purchase_date.isoformat(),  # 文字列に変換
            "shop_location": hobby.shop_location,
            "hobby_photo": hobby.hobby_photo,
            "comments": hobby.comments,
            "good": hobby.good
        }
        print(f"Hobby Photo Path: {hobby.hobby_photo}")  # デバッグ用
        response.append(hobby_data)
    return response

@app.get("/hobbys/top", response_model=List[Dict[str, Any]])
def read_top_hobbys(db: Session = Depends(get_db)):
    hobbys = crud.get_top_hobbys(db, limit=5)
    print(f"Top Hobbys: {hobbys}")  # デバッグ用
    response = []
    for hobby in hobbys:
        hobby_data = {
            "id": hobby.id,
            "username": hobby.username,
            "product": hobby.product,
            "purchase_date": hobby.purchase_date.isoformat(),  # 文字列に変換
            "shop_location": hobby.shop_location,
            "hobby_photo": hobby.hobby_photo,
            "comments": hobby.comments,
            "good": hobby.good
        }
        print(f"Hobby Photo Path: {hobby.hobby_photo}")  # デバッグ用
        response.append(hobby_data)
    return response

@app.get("/photos/{photo_path:path}")
def get_photo(photo_path: str):
    print(f"Photo Path: {photo_path}")  # デバッグ用
    return FileResponse(photo_path)

@app.post("/hobbys/{hobby_id}/like")
async def like_hobby(
    hobby_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    hobby = crud.get_hobby(db, hobby_id=hobby_id)
    if not hobby:
        raise HTTPException(status_code=404, detail="Hobby not found")
    
    hobby.good += 1
    db.commit()
    db.refresh(hobby)
    
    await update_user_point(PointUpdate(username=current_user.username, point=10), db)
    
    return {"message": "Hobby liked successfully", "good": hobby.good}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


def get_plot_data(db: Session, product: str):
    data = db.query(DataTable).all()
    
    # デバッグ：取得したデータを確認する
    print(data)
    
    # プロダクトに基づいてフィールドを選択
    field_mapping = {
        'regular_gasoline': 'Regular_Hokkaido',
        'premium_gasoline': 'High_octane_Hokkaido',
        'kerosene': 'Kerosene_Hokkaido'
    }
    
    if product not in field_mapping:
        raise ValueError("Invalid product")

    field = field_mapping[product]
    
    # グラフの作成
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=[row.SurveyDate for row in data],
                             y=[getattr(row, field) for row in data],
                             mode='lines',
                             name=field))
    fig.update_layout(title=f'{field} Prices Over Time')
    
    return fig


# データを取得してJSONレスポンスを返すエンドポイント
@app.get("/data", response_class=JSONResponse)
async def read_data(db: Session = Depends(get_db)):
    data = db.query(DataTable).all()
    data_dict = [
        {
            "SurveyDate": row.SurveyDate,
            "Regular_Hokkaido": float(row.Regular_Hokkaido),
            "High_octane_Hokkaido": row.High_octane_Hokkaido,
            "light_oil_Hokkaido": row.light_oil_Hokkaido,
            "Kerosene_Hokkaido": row.Kerosene_Hokkaido
        } for row in data
    ]
    return data_dict

# グラフを表示するエンドポイント
@app.get("/plot", response_class=JSONResponse)
async def plot_data(db: Session = Depends(get_db)):
    fig = get_plot_data(db)
    plot_html = fig.to_html(full_html=False, default_height=500, default_width=700)
    return {"plot_html": plot_html}
