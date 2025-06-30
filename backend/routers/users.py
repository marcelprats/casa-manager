from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database.db import SessionLocal
from backend.models.user import User
from backend.schemas.user import UserCreate, UserRead
from typing import List

router = APIRouter()

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/", response_model=UserRead)
async def crea_usuari(user: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.get("/", response_model=List[UserRead])
async def llista_usuaris(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()

@router.get("/{user_id}", response_model=UserRead)
async def obtenir_usuari(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuari no trobat")
    return user

@router.delete("/{user_id}")
async def elimina_usuari(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuari no trobat")
    await db.delete(user)
    await db.commit()
    return {"msg": f"Usuari {user_id} eliminat"}