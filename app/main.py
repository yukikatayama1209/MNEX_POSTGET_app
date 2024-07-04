from fastapi import FastAPI, Depends, HTTPException, status, Form, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta, date
from typing import Optional
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud
from .database import SessionLocal, engine
from passlib.context import CryptContext
from fastapi.responses import FileResponse
from pathlib import Path
import os

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5500",  # React開発サーバー
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(f"Generated token: {encoded_jwt}")
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        print(f"Token payload: {payload}")
        if username is None:
            raise credentials_exception
    except JWTError as e:
        print(f"JWT error: {str(e)}")
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"Received login request with username: {form_data.username}, password: {form_data.password}")
    user = crud.authenticate_user(db, form_data.username, form_data.password)
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

@app.post("/register", response_model=dict)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = crud.create_user(db=db, user=user)
        print(f"User registered with username: {user.username}")
        return {"success": True, "user_id": db_user.id}
    except Exception as e:
        print(f"Error registering user: {e}")
        raise HTTPException(status_code=400, detail="Registration failed")

@app.post("/prices/", response_model=schemas.Price)
async def create_price(
    product: str = Form(...),
    purchase_date: date = Form(...),
    shop_location: str = Form(...),
    comments: str = Form(...),
    product_photo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    product_photo_path = None
    if product_photo:
        product_photo_path = Path("app/photo_data/product") / product_photo.filename
        os.makedirs(product_photo_path.parent, exist_ok=True)
        with open(product_photo_path, "wb") as buffer:
            buffer.write(await product_photo.read())
        product_photo_path = str(product_photo_path)
    price_data = {
        "username": current_user.username,
        "product": product,
        "purchase_date": purchase_date,
        "shop_location": shop_location,
        "comments": comments,
        "product_photo": product_photo_path,
    }
    return crud.create_price(db=db, price=schemas.PriceCreate(**price_data))

@app.post("/hobbys/", response_model=schemas.Hobby)
async def create_hobby(
    product: str = Form(...),
    purchase_date: date = Form(...),
    shop_location: str = Form(...),
    comments: str = Form(...),
    hobby_photo: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    hobby_photo_path = None
    if hobby_photo:
        hobby_photo_path = Path("app/photo_data/hobby") / hobby_photo.filename
        os.makedirs(hobby_photo_path.parent, exist_ok=True)
        with open(hobby_photo_path, "wb") as buffer:
            buffer.write(await hobby_photo.read())
        hobby_photo_path = str(hobby_photo_path)
    hobby_data = {
        "username": current_user.username,
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

@app.get("/hobbys/latest", response_model=schemas.Hobby)
def get_latest_hobby(db: Session = Depends(get_db)):
    hobby = crud.get_latest_hobby(db)
    if hobby is None:
        raise HTTPException(status_code=404, detail="Hobby not found")
    return hobby

@app.post("/hobbys/{hobby_id}/like", response_model=schemas.Hobby)
def like_hobby(hobby_id: int, db: Session = Depends(get_db)):
    hobby = crud.increment_good(db, hobby_id)
    if hobby is None:
        raise HTTPException(status_code=404, detail="Hobby not found")
    return hobby
