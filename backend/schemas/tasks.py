from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    titol: str
    descripcio: Optional[str]
    data_inici: str
    data_fi: Optional[str]
    periodicitat: Optional[str]
    usuari_id: int

class TaskRead(TaskCreate):
    id: int
    class Config:
        orm_mode = True