from pydantic import BaseModel
from typing import Optional, List

class TaskCreate(BaseModel):
    titol: str
    descripcio: Optional[str]
    data_inici: str
    data_fi: Optional[str]
    periodicitat: Optional[str]
    usuaris_id: List[int]  # <-- llista d’IDs d’usuaris!
    feta: Optional[bool] = False

class TaskRead(TaskCreate):
    id: int
    class Config:
        orm_mode = True