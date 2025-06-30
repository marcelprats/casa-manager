from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import users, tasks

app = FastAPI()

# --- AFEGEIX AQUEST BLOC ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Permet només el teu frontend local
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