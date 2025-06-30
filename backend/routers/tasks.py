from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database.db import SessionLocal
from models.task import Task
from schemas.task import TaskCreate, TaskRead
from typing import List

router = APIRouter()

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/", response_model=TaskRead)
async def crea_tasca(task: TaskCreate, db: AsyncSession = Depends(get_db)):
    db_task = Task(**task.dict())
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[TaskRead])
async def llista_tasques(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task))
    return result.scalars().all()

@router.get("/{task_id}", response_model=TaskRead)
async def obtenir_tasca(task_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=404, detail="Tasca no trobada")
    return task

@router.delete("/{task_id}")
async def elimina_tasca(task_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=404, detail="Tasca no trobada")
    await db.delete(task)
    await db.commit()
    return {"msg": f"Tasca {task_id} eliminada"}