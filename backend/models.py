from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Judgment(Base):
    __tablename__ = "judgments"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    upload_date = Column(DateTime, default=datetime.utcnow)
    extracted_text = Column(Text)
    status = Column(String, default="Pending") # Pending, Processed, Verified
    
    # AI Extracted Data
    case_title = Column(String, nullable=True)
    court_name = Column(String, nullable=True)
    judgment_date = Column(String, nullable=True)
    directives = Column(JSON, nullable=True)
    deadlines = Column(JSON, nullable=True)
    responsible_authorities = Column(JSON, nullable=True)
    risk_level = Column(String, nullable=True) # High, Medium, Low
    recommendations = Column(JSON, nullable=True)
    explainable_reasoning = Column(JSON, nullable=True)
    
    # Audit Trail
    verified_by = Column(String, nullable=True)
    verified_at = Column(DateTime, nullable=True)
