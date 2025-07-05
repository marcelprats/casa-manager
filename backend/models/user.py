from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.orm import relationship  # <-- FALTAVA AIXÒ!
from backend.database.db import Base
from backend.models.task import task_user_association  # Assegura't que task_user_association està importat

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, index=True)
    data_naixement = Column(String, nullable=True)
    dades_extres = Column(JSON, nullable=True)

    tasques = relationship("Task", secondary=task_user_association, back_populates="usuaris")