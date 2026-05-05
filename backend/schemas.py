from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class JudgmentBase(BaseModel):
    filename: str

class JudgmentResponse(JudgmentBase):
    id: int
    upload_date: datetime
    status: str
    case_title: Optional[str] = None
    court_name: Optional[str] = None
    judgment_date: Optional[str] = None
    risk_level: Optional[str] = None
    verified_by: Optional[str] = None

    class Config:
        from_attributes = True

class JudgmentDetailResponse(JudgmentResponse):
    extracted_text: Optional[str] = None
    directives: Optional[List[Dict[str, Any]]] = None
    deadlines: Optional[List[Dict[str, Any]]] = None
    responsible_authorities: Optional[List[str]] = None
    recommendations: Optional[List[Dict[str, Any]]] = None
    explainable_reasoning: Optional[List[Dict[str, Any]]] = None

class VerificationRequest(BaseModel):
    verified_by: str
    status: str # Verified or Rejected
