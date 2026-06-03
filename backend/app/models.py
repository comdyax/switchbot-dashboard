from datetime import datetime

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base

# These mirror db/init.sql, which remains the source of truth for the schema.
# The ORM is used as a query layer only — no migrations are generated from here.


class Device(Base):
    __tablename__ = "devices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    mac: Mapped[str] = mapped_column(String(17), unique=True)
    name: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime]


class Reading(Base):
    __tablename__ = "readings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    device_mac: Mapped[str] = mapped_column(String(17), index=True)
    temperature: Mapped[float]
    humidity: Mapped[float]
    battery: Mapped[int]
    timestamp: Mapped[datetime]
