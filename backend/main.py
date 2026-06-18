from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from database import engine, Base
from routers import auth, predict, admin

# Initialize DB
Base.metadata.create_all(bind=engine)

# Auto-train AI Model if not exists
from train_model import train_and_save_model
train_and_save_model()

app = FastAPI(title="DIAB-CARE Backend", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to DIAB-CARE API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
