import os
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import urllib.request

def train_and_save_model():
    model_path = "models_ai/diabetes_model.pkl"
    accuracy_path = "models_ai/model_accuracy.txt"
    
    # Train only if it doesn't exist
    if os.path.exists(model_path):
        print("Model already exists. Skipping training.")
        return

    print("Downloading dataset...")
    url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
    columns = [
        "Pregnancies", "Glucose", "BloodPressure", "SkinThickness", 
        "Insulin", "BMI", "DiabetesPedigreeFunction", "Age", "Outcome"
    ]
    
    try:
        df = pd.read_csv(url, header=None, names=columns)
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        return
    
    X = df.drop("Outcome", axis=1)
    y = df["Outcome"]
    
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print("Training Random Forest model...")
    rf_model = RandomForestClassifier(
        n_estimators=200, 
        max_depth=8, 
        random_state=42
    )
    rf_model.fit(X_train, y_train)
    
    y_pred = rf_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    os.makedirs("models_ai", exist_ok=True)
    
    joblib.dump(rf_model, model_path)
    
    with open(accuracy_path, "w") as f:
        f.write(str(accuracy))
        
    print(f"Model saved successfully to {model_path}")
    print(f"Model Accuracy: {accuracy:.4f}")

if __name__ == "__main__":
    train_and_save_model()
