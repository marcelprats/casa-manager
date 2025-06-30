import asyncio
from backend.database.db import engine, Base

from backend.models.task import Task
from backend.models.user import User


async def create_all():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Taules creades!")

if __name__ == "__main__":
    asyncio.run(create_all())