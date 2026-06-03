from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud, schemas
from ..database import get_session

router = APIRouter(prefix="/api/sensors", tags=["sensors"])


@router.get("", response_model=list[schemas.Sensor])
async def list_sensors(session: AsyncSession = Depends(get_session)):
    """All devices with their most recent reading — powers the dashboard cards."""
    return await crud.get_sensors_with_latest(session)


@router.get("/{mac}/latest", response_model=schemas.Reading)
async def latest_reading(mac: str, session: AsyncSession = Depends(get_session)):
    latest = await crud.get_latest_for_device(session, mac)
    if latest is None:
        raise HTTPException(
            status_code=404, detail="No readings for this device")
    return latest


@router.get("/{mac}/history", response_model=schemas.HistoryResponse)
async def history(
    mac: str,
    session: AsyncSession = Depends(get_session),
    interval: str = Query("hour", pattern="^(minute|hour|day|week|month)$"),
    start: datetime | None = None,
    end: datetime | None = None,
):
    """Time-bucketed aggregation for plotting. Defaults to the last 24 hours."""
    now = datetime.now(timezone.utc)
    end = end or now
    start = start or end - timedelta(hours=24)
    if start >= end:
        raise HTTPException(status_code=400, detail="start must be before end")

    if not await crud.device_exists(session, mac):
        raise HTTPException(status_code=404, detail="Unknown device")

    points = await crud.get_history(session, mac, start, end, interval)
    return schemas.HistoryResponse(
        mac=mac, interval=interval, start=start, end=end, points=points
    )
