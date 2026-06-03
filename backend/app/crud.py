from datetime import datetime

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

# Whitelist of allowed time buckets. The value is interpolated into the SQL,
# so it MUST come from this map and never directly from user input.
ALLOWED_INTERVALS: dict[str, str] = {
    "minute": "minute",
    "hour": "hour",
    "day": "day",
    "week": "week",
    "month": "month",
}


async def get_sensors_with_latest(session: AsyncSession) -> list[dict]:
    """Every device joined with its most recent reading (latest may be null)."""
    result = await session.execute(
        text(
            """
            SELECT d.mac, d.name,
                   r.temperature, r.humidity, r.battery, r.timestamp
            FROM devices d
            LEFT JOIN LATERAL (
                SELECT temperature, humidity, battery, timestamp
                FROM readings
                WHERE device_mac = d.mac
                ORDER BY timestamp DESC
                LIMIT 1
            ) r ON true
            ORDER BY d.name
            """
        )
    )
    sensors: list[dict] = []
    for row in result.mappings():
        latest = None
        if row["timestamp"] is not None:
            latest = {
                "temperature": row["temperature"],
                "humidity": row["humidity"],
                "battery": row["battery"],
                "timestamp": row["timestamp"],
            }
        sensors.append(
            {"mac": row["mac"], "name": row["name"], "latest": latest})
    return sensors


async def get_latest_for_device(session: AsyncSession, mac: str) -> dict | None:
    result = await session.execute(
        text(
            """
            SELECT temperature, humidity, battery, timestamp
            FROM readings
            WHERE device_mac = :mac
            ORDER BY timestamp DESC
            LIMIT 1
            """
        ),
        {"mac": mac},
    )
    row = result.mappings().first()
    return dict(row) if row else None


async def device_exists(session: AsyncSession, mac: str) -> bool:
    result = await session.execute(
        text("SELECT 1 FROM devices WHERE mac = :mac"), {"mac": mac}
    )
    return result.first() is not None


async def get_history(
    session: AsyncSession,
    mac: str,
    start: datetime,
    end: datetime,
    interval: str,
) -> list[dict]:
    bucket = ALLOWED_INTERVALS[interval]  # caller validates; KeyError if not
    result = await session.execute(
        text(
            f"""
            SELECT date_trunc('{bucket}', timestamp) AS bucket,
                   AVG(temperature) AS temperature_avg,
                   MIN(temperature) AS temperature_min,
                   MAX(temperature) AS temperature_max,
                   AVG(humidity)    AS humidity_avg,
                   MIN(humidity)    AS humidity_min,
                   MAX(humidity)    AS humidity_max
            FROM readings
            WHERE device_mac = :mac
              AND timestamp >= :start
              AND timestamp <  :end
            GROUP BY bucket
            ORDER BY bucket
            """
        ),
        {"mac": mac, "start": start, "end": end},
    )
    return [dict(row) for row in result.mappings()]
