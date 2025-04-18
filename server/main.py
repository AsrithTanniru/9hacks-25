from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import random
import string

from database import get_db, engine
import models
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
import qrcode
from io import BytesIO
from fastapi.responses import StreamingResponse
import base64
from PIL import Image

# Create all tables in the database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="QR Rewards API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
# Pydantic models for request/response
class BrandBase(BaseModel):
    name: str
    logo_url: Optional[str] = None

class BrandCreate(BrandBase):
    pass

class BrandResponse(BrandBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class QRCodeBase(BaseModel):
    points_value: int = 10
    description: Optional[str] = None
    is_active: bool = True

class QRCodeCreate(QRCodeBase):
    brand_id: int

class QRCodeResponse(QRCodeBase):
    id: int
    brand_id: int
    unique_code: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    total_points: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class QRScanBase(BaseModel):
    user_id: int
    qr_code_id: int
    game_played: Optional[str] = None
    game_score: Optional[int] = None

class QRScanCreate(QRScanBase):
    pass

class QRScanResponse(QRScanBase):
    id: int
    points_earned: int
    scanned_at: datetime
    
    class Config:
        orm_mode = True

class GamePlayResponse(BaseModel):
    message: str
    points_earned: int
    total_points: int

# Helper function to generate unique QR codes
def generate_unique_code(db: Session):
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        qr_code = db.query(models.QRCode).filter(models.QRCode.unique_code == code).first()
        if not qr_code:
            return code

# --- BRAND DASHBOARD ENDPOINTS ---
@app.get('/')
def home():
    return f'Hellooo'

@app.post("/brands/", response_model=BrandResponse, tags=["Brand Dashboard"])
def create_brand(brand: BrandCreate, db: Session = Depends(get_db)):
    db_brand = models.Brand(**brand.dict())
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand

@app.get("/get-brands/", response_model=List[BrandResponse], tags=["Brand Dashboard"])
def get_brands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    brands = db.query(models.Brand).offset(skip).limit(limit).all()
    return brands

@app.get("/brands/{brand_id}", response_model=BrandResponse, tags=["Brand Dashboard"])
def get_brand(brand_id: int, db: Session = Depends(get_db)):
    brand = db.query(models.Brand).filter(models.Brand.id == brand_id).first()
    if brand is None:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@app.post("/qrcodes/", response_model=QRCodeResponse, tags=["Brand Dashboard"])
def create_qr_code(qr_code: QRCodeCreate, db: Session = Depends(get_db)):
    # Check if brand exists
    brand = db.query(models.Brand).filter(models.Brand.id == qr_code.brand_id).first()
    if brand is None:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    unique_code = generate_unique_code(db)
    db_qr_code = models.QRCode(**qr_code.dict(), unique_code=unique_code)
    db.add(db_qr_code)
    db.commit()
    db.refresh(db_qr_code)
    return db_qr_code

@app.get("/brands/{brand_id}/qrcodes/", response_model=List[QRCodeResponse], tags=["Brand Dashboard"])
def get_brand_qr_codes(brand_id: int, db: Session = Depends(get_db)):
    brand = db.query(models.Brand).filter(models.Brand.id == brand_id).first()
    if brand is None:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    qr_codes = db.query(models.QRCode).filter(models.QRCode.brand_id == brand_id).all()
    return qr_codes

@app.get("/brands/{brand_id}/stats/", tags=["Brand Dashboard"])
def get_brand_stats(brand_id: int, db: Session = Depends(get_db)):
    brand = db.query(models.Brand).filter(models.Brand.id == brand_id).first()
    if brand is None:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    # Get QR codes for this brand
    qr_codes = db.query(models.QRCode).filter(models.QRCode.brand_id == brand_id).all()
    qr_ids = [qr.id for qr in qr_codes]
    
    # Get scan stats
    total_scans = db.query(models.QRScan).filter(models.QRScan.qr_code_id.in_(qr_ids)).count()
    unique_users = db.query(models.QRScan.user_id).filter(
        models.QRScan.qr_code_id.in_(qr_ids)
    ).distinct().count()
    
    # Get points distributed
    total_points = db.query(models.QRScan).filter(
        models.QRScan.qr_code_id.in_(qr_ids)
    ).with_entities(models.QRScan.points_earned).all()
    
    points_sum = sum([points[0] for points in total_points]) if total_points else 0
    
    return {
        "brand_name": brand.name,
        "total_qr_codes": len(qr_codes),
        "active_qr_codes": len([qr for qr in qr_codes if qr.is_active]),
        "total_scans": total_scans,
        "unique_users": unique_users,
        "total_points_distributed": points_sum
    }

# --- MOBILE APP ENDPOINTS ---

@app.post("/users/", response_model=UserResponse, tags=["Mobile App"])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=UserResponse, tags=["Mobile App"])
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/qr/scan/{unique_code}", tags=["Mobile App"])
def scan_qr_code(unique_code: str, user_id: int, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if QR code exists and is active
    qr_code = db.query(models.QRCode).filter(
        models.QRCode.unique_code == unique_code,
        models.QRCode.is_active == True
    ).first()
    
    if qr_code is None:
        raise HTTPException(status_code=404, detail="QR code not found or inactive")
    
    # Check if this user has already scanned this QR code
    existing_scan = db.query(models.QRScan).filter(
        models.QRScan.user_id == user_id,
        models.QRScan.qr_code_id == qr_code.id
    ).first()
    
    if existing_scan:
        return {"message": "You've already scanned this QR code", "eligible_for_game": False}
    
    # Return info about the QR code and that user is eligible to play the game
    brand = db.query(models.Brand).filter(models.Brand.id == qr_code.brand_id).first()
    
    return {
        "message": f"QR code from {brand.name} scanned successfully!",
        "eligible_for_game": True,
        "qr_code_id": qr_code.id,
        "brand_name": brand.name,
        "description": qr_code.description,
        "points_available": qr_code.points_value
    }

@app.post("/game/play", response_model=GamePlayResponse, tags=["Mobile App"])
def play_game(scan: QRScanCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(models.User).filter(models.User.id == scan.user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if QR code exists
    qr_code = db.query(models.QRCode).filter(models.QRCode.id == scan.qr_code_id).first()
    if qr_code is None:
        raise HTTPException(status_code=404, detail="QR code not found")
    
    # Calculate points based on game score (simple algorithm - can be customized)
    base_points = qr_code.points_value
    
    # If game_score is provided, adjust points based on score
    if scan.game_score:
        # Simple algorithm: points are proportional to score (max 2x base points)
        points_earned = min(base_points * (1 + scan.game_score / 100), base_points * 2)
    else:
        points_earned = base_points
        
    points_earned = int(points_earned)  # Convert to integer
    
    # Create scan record
    db_scan = models.QRScan(
        user_id=scan.user_id,
        qr_code_id=scan.qr_code_id,
        points_earned=points_earned,
        game_played=scan.game_played,
        game_score=scan.game_score
    )
    
    # Update user's total points
    user.total_points += points_earned
    
    db.add(db_scan)
    db.commit()
    
    return {
        "message": "Game completed successfully!",
        "points_earned": points_earned,
        "total_points": user.total_points
    }

@app.get("/users/{user_id}/history", tags=["Mobile App"])
def get_user_scan_history(user_id: int, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's scan history with brand details
    scans = db.query(models.QRScan).filter(models.QRScan.user_id == user_id).all()
    
    scan_history = []
    for scan in scans:
        qr = db.query(models.QRCode).filter(models.QRCode.id == scan.qr_code_id).first()
        brand = db.query(models.Brand).filter(models.Brand.id == qr.brand_id).first()
        
        scan_history.append({
            "scan_id": scan.id,
            "brand_name": brand.name,
            "points_earned": scan.points_earned,
            "game_played": scan.game_played,
            "game_score": scan.game_score,
            "scanned_at": scan.scanned_at.isoformat()
        })
    
    return {
        "username": user.username,
        "total_points": user.total_points,
        "scan_history": scan_history
    }

@app.post("/qrcodes/generate-image", tags=["Brand Dashboard"])
def generate_qr_image(
    unique_code: str = Query(..., description="The unique code for the QR"),
    size: int = Query(300, description="Size of the QR code in pixels")
):
    """Generate a QR code image from a unique code"""
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # The data will be a URL to your scan endpoint
    # In production, use your actual domain
    data = f"https://yourapp.com/scan/{unique_code}"
    
    # Add data
    qr.add_data(data)
    qr.make(fit=True)
    
    # Create an image from the QR Code instance
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save image to BytesIO object
    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    
    # Return the image as a response
    return StreamingResponse(buf, media_type="image/png")


# Add another endpoint to create a QR code and return base64 image data
@app.post("/qrcodes/create-with-image", response_model=QRCodeResponse, tags=["Brand Dashboard"])
def create_qr_with_image(qr_code: QRCodeCreate, size: int = Query(300, description="Size of the QR code in pixels"), db: Session = Depends(get_db)):
    # Check if brand exists
    brand = db.query(models.Brand).filter(models.Brand.id == qr_code.brand_id).first()
    if brand is None:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    unique_code = generate_unique_code(db)
    db_qr_code = models.QRCode(**qr_code.dict(), unique_code=unique_code)
    db.add(db_qr_code)
    db.commit()
    db.refresh(db_qr_code)

    # Generate QR code image with the specified size
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=max(1, size // 30),  # Adjust box size based on requested image size
        border=4,
    )
    
    # The data will be a URL to your scan endpoint
    # In production, use your actual domain
    data = f"https://yourapp.com/scan/{unique_code}"
    
    # Add data
    qr.add_data(data)
    qr.make(fit=True)
    
    # Create an image from the QR Code instance
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Resize to requested dimensions
    from PIL import Image
    img = img.resize((size, size), Image.LANCZOS)
    
    # Save image to BytesIO object
    buf = BytesIO()
    img.save(buf, format='PNG')
    
    # Convert to base64 for embedding in response
    base64_img = base64.b64encode(buf.getvalue()).decode('utf-8')
    
    response_data = {**db_qr_code.__dict__}
    response_data["qr_image_base64"] = f"data:image/png;base64,{base64_img}"
    
    return response_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
