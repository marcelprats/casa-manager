from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Table
from sqlalchemy.orm import relationship
from backend.database.db import Base

# Taula associativa
task_user_association = Table(
    "task_user_association",
    Base.metadata,
    Column("task_id", Integer, ForeignKey("tasks.id")),
    Column("user_id", Integer, ForeignKey("users.id"))
)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    titol = Column(String, index=True)
    descripcio = Column(String, nullable=True)
    data_inici = Column(String)
    data_fi = Column(String, nullable=True)
    periodicitat = Column(String, nullable=True)
    feta = Column(Boolean, default=False)
    # Relació molts a molts
    usuaris = relationship("User", secondary=task_user_association, back_populates="tasques")