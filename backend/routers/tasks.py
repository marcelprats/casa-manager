from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from backend.database.db import SessionLocal
from backend.models.task import Task
from backend.models.user import User
from backend.schemas.tasks import TaskCreate, TaskRead
from typing import List

router = APIRouter()

async def get_db():
    async with SessionLocal() as session:
        yield session

def to_task_read(db_task: Task) -> TaskRead:
    return TaskRead(
        id=db_task.id,
        titol=db_task.titol,
        descripcio=db_task.descripcio,
        data_inici=db_task.data_inici,
        data_fi=db_task.data_fi,
        periodicitat=db_task.periodicitat,
        feta=db_task.feta,
        usuaris_id=[u.id for u in getattr(db_task, "usuaris", [])]
    )

@router.post("/", response_model=TaskRead)
async def crea_tasca(task: TaskCreate, db: AsyncSession = Depends(get_db)):
    db_task = Task(
        titol=task.titol,
        descripcio=task.descripcio,
        data_inici=task.data_inici,
        data_fi=task.data_fi,
        periodicitat=task.periodicitat,
        feta=task.feta
    )
    # Assigna usuaris
    if task.usuaris_id:
        result = await db.execute(select(User).where(User.id.in_(task.usuaris_id)))
        usuaris = result.scalars().all()
        db_task.usuaris = usuaris
    else:
        db_task.usuaris = []
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    # Recarrega la tasca amb relació usuaris carregada per evitar greenlet error
    result = await db.execute(
        select(Task).options(selectinload(Task.usuaris)).where(Task.id == db_task.id)
    )
    db_task_fresh = result.scalar_one()
    return to_task_read(db_task_fresh)

@router.get("/", response_model=List[TaskRead])
async def llista_tasques(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Task).options(selectinload(Task.usuaris))
    )
    tasks = result.scalars().all()
    return [to_task_read(task) for task in tasks]

@router.get("/{task_id}", response_model=TaskRead)
async def obtenir_tasca(task_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Task).options(selectinload(Task.usuaris)).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=404, detail="Tasca no trobada")
    return to_task_read(task)

@router.put("/{task_id}", response_model=TaskRead)
async def edita_tasca(task_id: int, task: TaskCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Task).options(selectinload(Task.usuaris)).where(Task.id == task_id)
    )
    db_task = result.scalar_one_or_none()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Tasca no trobada")
    db_task.titol = task.titol
    db_task.descripcio = task.descripcio
    db_task.data_inici = task.data_inici
    db_task.data_fi = task.data_fi
    db_task.periodicitat = task.periodicitat
    db_task.feta = task.feta
    # Actualitza usuaris
    if task.usuaris_id:
        users = (await db.execute(select(User).where(User.id.in_(task.usuaris_id)))).scalars().all()
        db_task.usuaris = users
    else:
        db_task.usuaris = []
    await db.commit()
    await db.refresh(db_task)
    # Torna a carregar la tasca per assegurar la relació carregada
    result = await db.execute(
        select(Task).options(selectinload(Task.usuaris)).where(Task.id == db_task.id)
    )
    db_task_refreshed = result.scalar_one()
    return to_task_read(db_task_refreshed)

@router.delete("/{task_id}")
async def elimina_tasca(task_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=404, detail="Tasca no trobada")
    await db.delete(task)
    await db.commit()
    return {"msg": f"Tasca {task_id} eliminada"}