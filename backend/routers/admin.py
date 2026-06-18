from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import os
from database import get_db
from models import User, Prediction
from schemas import AdminStats, AdminPredictionItem
from routers.auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])

ACCURACY_PATH = "models_ai/model_accuracy.txt"

@router.get("/stats", response_model=AdminStats)
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.email != "admin@diabcare.ai":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have administrative privileges"
        )
        
    total_users = db.query(User).count()
    total_tests = db.query(Prediction).count()
    
    positive_predictions = db.query(Prediction).filter(Prediction.prediction == "Positive").count()
    negative_predictions = db.query(Prediction).filter(Prediction.prediction == "Negative").count()
    
    model_accuracy = 0.0
    if os.path.exists(ACCURACY_PATH):
        with open(ACCURACY_PATH, "r") as f:
            try:
                model_accuracy = float(f.read().strip())
            except ValueError:
                pass
                
    query_results = db.query(
        Prediction.id,
        Prediction.user_id,
        User.firstname,
        User.lastname,
        Prediction.pregnancies,
        Prediction.glucose,
        Prediction.blood_pressure,
        Prediction.skin_thickness,
        Prediction.insulin,
        Prediction.bmi,
        Prediction.diabetes_pedigree_function,
        Prediction.age,
        Prediction.prediction,
        Prediction.probability,
        Prediction.risk_level,
        Prediction.created_at
    ).outerjoin(User, Prediction.user_id == User.id).order_by(Prediction.created_at.desc()).limit(50).all()

    recent_preds = []
    for r in query_results:
        recent_preds.append({
            "id": r[0],
            "user_id": r[1],
            "firstname": r[2] if r[2] else "Guest",
            "lastname": r[3] if r[3] else "User",
            "pregnancies": r[4],
            "glucose": r[5],
            "blood_pressure": r[6],
            "skin_thickness": r[7],
            "insulin": r[8],
            "bmi": r[9],
            "diabetes_pedigree_function": r[10],
            "age": r[11],
            "prediction": r[12],
            "probability": r[13],
            "risk_level": r[14],
            "created_at": r[15]
        })
                
    return {
        "total_users": total_users,
        "total_tests": total_tests,
        "positive_predictions": positive_predictions,
        "negative_predictions": negative_predictions,
        "model_accuracy": round(model_accuracy * 100, 2),
        "recent_predictions": recent_preds
    }
