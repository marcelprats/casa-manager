from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import users, tasks

app = FastAPI()

# --- AFEGEIX AQUEST BLOC ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

@app.get("/")
def root():
    return {"msg": "Casa Manager Backend"}