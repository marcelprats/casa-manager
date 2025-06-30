from sqlalchemy import Column, Integer, String, JSON
from backend.database.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, index=True)
    data_naixement = Column(String, nullable=True)
    dades_extres = Column(JSON, nullable=True)