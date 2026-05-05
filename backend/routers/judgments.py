from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Judgment
from ..schemas import JudgmentResponse, JudgmentDetailResponse, VerificationRequest
from ..services.document_pipeline import extract_text_from_pdf
from ..services.intelligence_engine import process_judgment_text
import shutil
import os
from datetime import datetime

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=JudgmentDetailResponse)
async def upload_judgment(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Extract text
    text = extract_text_from_pdf(file_location)
    
    # Process with LLM
    try:
        ai_results = process_judgment_text(text)
    except Exception as e:
        ai_results = {}
        print(f"Error in LLM processing: {e}")

    # Save to DB
    judgment = Judgment(
        filename=file.filename,
        extracted_text=text,
        status="Processed",
        case_title=ai_results.get("case_title"),
        court_name=ai_results.get("court_name"),
        judgment_date=ai_results.get("judgment_date"),
        directives=ai_results.get("directives"),
        deadlines=ai_results.get("deadlines"),
        responsible_authorities=ai_results.get("responsible_authorities"),
        risk_level=ai_results.get("risk_level"),
        recommendations=ai_results.get("recommendations"),
        explainable_reasoning=ai_results.get("explainable_reasoning")
    )
    
    db.add(judgment)
    db.commit()
    db.refresh(judgment)
    
    return judgment

@router.get("/", response_model=List[JudgmentResponse])
def get_judgments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    judgments = db.query(Judgment).order_by(Judgment.upload_date.desc()).offset(skip).limit(limit).all()
    return judgments

@router.get("/{judgment_id}", response_model=JudgmentDetailResponse)
def get_judgment(judgment_id: int, db: Session = Depends(get_db)):
    judgment = db.query(Judgment).filter(Judgment.id == judgment_id).first()
    if not judgment:
        raise HTTPException(status_code=404, detail="Judgment not found")
    return judgment

@router.post("/{judgment_id}/verify")
def verify_judgment(judgment_id: int, req: VerificationRequest, db: Session = Depends(get_db)):
    judgment = db.query(Judgment).filter(Judgment.id == judgment_id).first()
    if not judgment:
        raise HTTPException(status_code=404, detail="Judgment not found")
    
    judgment.status = req.status
    judgment.verified_by = req.verified_by
    judgment.verified_at = datetime.utcnow()
    
    db.commit()
    db.refresh(judgment)
    return {"message": "Verification status updated successfully", "status": judgment.status}
