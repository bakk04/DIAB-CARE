import unittest
import json
import os
import sys
from fastapi.testclient import TestClient

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app
from database import SessionLocal, Base, engine
from models import User, Prediction

class TestDiabCareBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # We will use the live FastAPI app with a TestClient
        cls.client = TestClient(app)
        
        # Clear test accounts if they exist to run cleanly
        db = SessionLocal()
        try:
            db.query(Prediction).delete()
            db.query(User).filter(User.email.in_(["testuser@diabcare.com", "admin@diabcare.ai"])).delete()
            db.commit()
        except Exception as e:
            db.rollback()
        finally:
            db.close()

    def test_01_user_registration(self):
        # 1. Register a test user
        register_payload = {
            "firstname": "Test",
            "lastname": "User",
            "email": "testuser@diabcare.com",
            "password": "securepassword123",
            "gender": "Female",
            "age": 30
        }
        response = self.client.post("/api/register", json=register_payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], "testuser@diabcare.com")
        self.assertEqual(data["firstname"], "Test")
        self.assertIn("id", data)

        # 2. Registering same email again should fail
        response = self.client.post("/api/register", json=register_payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Email already registered", response.json()["detail"])

    def test_02_user_login(self):
        # Login with test user
        login_payload = {
            "email": "testuser@diabcare.com",
            "password": "securepassword123"
        }
        response = self.client.post("/api/login", json=login_payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["token_type"], "bearer")
        self.assertIn("user_id", data)
        
        # Store for subsequent tests
        self.__class__.token = data["access_token"]
        self.__class__.user_id = data["user_id"]

        # Invalid login should fail
        login_payload["password"] = "wrongpassword"
        response = self.client.post("/api/login", json=login_payload)
        self.assertEqual(response.status_code, 401)

    def test_03_get_profile(self):
        # Get profile with valid token
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.client.get(f"/api/profile/{self.user_id}", headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], "testuser@diabcare.com")
        self.assertEqual(data["firstname"], "Test")
        self.assertEqual(data["predictions"], [])

        # Requesting profile without token should fail
        response = self.client.get(f"/api/profile/{self.user_id}")
        self.assertEqual(response.status_code, 401)

        # Requesting another profile should fail (auth check)
        response = self.client.get("/api/profile/9999", headers=headers)
        self.assertEqual(response.status_code, 403)

    def test_04_ai_prediction(self):
        # Perform prediction with realistic Positive values
        predict_payload = {
            "pregnancies": 6,
            "glucose": 148.0,
            "bloodPressure": 72.0,
            "skinThickness": 35.0,
            "insulin": 0.0,
            "bmi": 33.6,
            "diabetesPedigreeFunction": 0.627,
            "age": 50
        }
        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.client.post("/api/predict", json=predict_payload, headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify structure
        self.assertIn("prediction", data)
        self.assertIn("probability", data)
        self.assertIn("risk_level", data)
        self.assertIn("recommendations", data)
        self.assertTrue(len(data["recommendations"]) > 0)
        
        # Verify database save
        db = SessionLocal()
        db_pred = db.query(Prediction).filter(Prediction.user_id == self.user_id).first()
        self.assertIsNotNone(db_pred)
        self.assertEqual(db_pred.glucose, 148.0)
        self.assertEqual(db_pred.prediction, data["prediction"])
        db.close()

    def test_05_admin_stats(self):
        # 1. Register admin user
        register_payload = {
            "firstname": "System",
            "lastname": "Administrator",
            "email": "admin@diabcare.ai",
            "password": "adminpassword123",
            "gender": "Male",
            "age": 40
        }
        self.client.post("/api/register", json=register_payload)

        # 2. Login as admin
        login_payload = {
            "email": "admin@diabcare.ai",
            "password": "adminpassword123"
        }
        response = self.client.post("/api/login", json=login_payload)
        self.assertEqual(response.status_code, 200)
        admin_token = response.json()["access_token"]

        # 3. Query stats as admin
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = self.client.get("/api/admin/stats", headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertTrue(data["total_users"] >= 2)
        self.assertTrue(data["total_tests"] >= 1)
        self.assertTrue(len(data["recent_predictions"]) >= 1)
        self.assertIn("model_accuracy", data)

        # 4. Access admin stats as non-admin test user should fail (Forbidden)
        user_headers = {"Authorization": f"Bearer {self.token}"}
        response = self.client.get("/api/admin/stats", headers=user_headers)
        self.assertEqual(response.status_code, 403)

if __name__ == "__main__":
    unittest.main()
