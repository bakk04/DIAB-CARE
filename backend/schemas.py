from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    password: str
    gender: str
    age: int

class UserResponse(BaseModel):
    id: int
    firstname: str
    lastname: str
    email: str
    gender: str
    age: int
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int

class PredictionRequest(BaseModel):
    user_id: Optional[int] = None
    pregnancies: int
    glucose: float
    bloodPressure: float
    skinThickness: float
    insulin: float
    bmi: float
    diabetesPedigreeFunction: float
    age: int

class PredictionResponse(BaseModel):
    prediction: str
    probability: float
    risk_level: str
    recommendations: List[str]

class PredictionHistoryItem(BaseModel):
    id: int
    created_at: datetime
    prediction: str
    risk_level: str
    glucose: float
    probability: float
    pregnancies: int
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree_function: float
    age: int

    class Config:
        from_attributes = True

class UserProfileResponse(BaseModel):
    id: int
    firstname: str
    lastname: str
    email: str
    gender: str
    age: int
    created_at: datetime
    predictions: List[PredictionHistoryItem] = []

    class Config:
        from_attributes = True

class AdminPredictionItem(BaseModel):
    id: int
    user_id: Optional[int]
    firstname: Optional[str]
    lastname: Optional[str]
    pregnancies: int
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree_function: float
    age: int
    prediction: str
    probability: float
    risk_level: str
    created_at: datetime

    class Config:
        from_attributes = True

class AdminStats(BaseModel):
    total_users: int
    total_tests: int
    positive_predictions: int
    negative_predictions: int
    model_accuracy: float
    recent_predictions: List[AdminPredictionItem] = []
