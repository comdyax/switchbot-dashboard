from datetime import datetime

from pydantic import BaseModel, ConfigDict


class Reading(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    temperature: float
    humidity: float
    battery: int
    timestamp: datetime


class Sensor(BaseModel):
    """A device plus its most recent reading (may be null if it has none yet)."""

    model_config = ConfigDict(from_attributes=True)

    mac: str
    name: str
    latest: Reading | None = None


class HistoryPoint(BaseModel):
    bucket: datetime
    temperature_avg: float
    temperature_min: float
    temperature_max: float
    humidity_avg: float
    humidity_min: float
    humidity_max: float


class HistoryResponse(BaseModel):
    mac: str
    interval: str
    start: datetime
    end: datetime
    points: list[HistoryPoint]
