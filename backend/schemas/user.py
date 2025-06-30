from pydantic import BaseModel
from typing import Optional, Dict

class UserCreate(BaseModel):
    nom: str
    data_naixement: Optional[str]
    dades_extres: Optional[Dict] = {}

class UserRead(UserCreate):
    id: int
    class Config:
        orm_mode = True