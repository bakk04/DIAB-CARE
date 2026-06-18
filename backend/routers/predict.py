from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import joblib
import pandas as pd
import os
from database import get_db
from models import Prediction, User
from schemas import PredictionRequest, PredictionResponse
from routers.auth import get_current_user

router = APIRouter(prefix="/api", tags=["predict"])

MODEL_PATH = "models_ai/diabetes_model.pkl"

# Lazy load model
model = None

def get_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise HTTPException(status_code=500, detail="Model not trained yet. Run train_model.py first.")
        model = joblib.load(MODEL_PATH)
    return model

def get_recommendations(risk_level: str):
    if risk_level == "High Risk":
        return [
            "Healthy diet",
            "Regular exercise",
            "Consult your doctor"
        ]
    else:
        return [
            "Maintain a healthy and balanced diet.",
            "Exercise regularly to stay fit.",
            "Go for routine medical check-ups."
        ]

@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rf_model = get_model()
    
    # Prepare input dataframe
    input_data = pd.DataFrame([{
        "Pregnancies": request.pregnancies,
        "Glucose": request.glucose,
        "BloodPressure": request.bloodPressure,
        "SkinThickness": request.skinThickness,
        "Insulin": request.insulin,
        "BMI": request.bmi,
        "DiabetesPedigreeFunction": request.diabetesPedigreeFunction,
        "Age": request.age
    }])
    
    prediction_result = rf_model.predict(input_data)[0]
    probabilities = rf_model.predict_proba(input_data)[0]
    
    probability = float(probabilities[1]) * 100 # Prob of class 1 (Positive)
    
    pred_text = "Positive" if prediction_result == 1 else "Negative"
    risk_level = "High Risk" if prediction_result == 1 else "Low Risk"
    
    recommendations = get_recommendations(risk_level)
    
    # Save to SQLite
    db_prediction = Prediction(
        user_id=current_user.id,
        pregnancies=request.pregnancies,
        glucose=request.glucose,
        blood_pressure=request.bloodPressure,
        skin_thickness=request.skinThickness,
        insulin=request.insulin,
        bmi=request.bmi,
        diabetes_pedigree_function=request.diabetesPedigreeFunction,
        age=request.age,
        prediction=pred_text,
        probability=probability,
        risk_level=risk_level
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    
    return {
        "prediction": pred_text,
        "probability": round(probability, 2),
        "risk_level": risk_level,
        "recommendations": recommendations
    }
