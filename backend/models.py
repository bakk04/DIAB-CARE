from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String)
    lastname = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    gender = Column(String)
    age = Column(Integer)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    pregnancies = Column(Integer)
    glucose = Column(Float)
    blood_pressure = Column(Float)
    skin_thickness = Column(Float)
    insulin = Column(Float)
    bmi = Column(Float)
    diabetes_pedigree_function = Column(Float)
    age = Column(Integer)
    prediction = Column(String)
    probability = Column(Float)
    risk_level = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
