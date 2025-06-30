from fastapi import FastAPI
from routers import users, tasks

app = FastAPI()

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

@app.get("/")
def root():
    return {"msg": "Casa Manager Backend"}