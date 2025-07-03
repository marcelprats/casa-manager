from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from backend.database.db import Base

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    titol = Column(String, index=True)
    descripcio = Column(String, nullable=True)
    data_inici = Column(String)
    data_fi = Column(String, nullable=True)
    periodicitat = Column(String, nullable=True)
    usuari_id = Column(Integer, ForeignKey("users.id"))
    feta = Column(Boolean, default=False)