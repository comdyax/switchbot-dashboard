import asyncio
import json
import logging
import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from bleak import BleakScanner
import asyncpg

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

DEVICES: dict[str, str] = json.loads(os.getenv("BLE_DEVICES", "{}"))
SCAN_INTERVAL: int = int(os.getenv("BLE_SCAN_INTERVAL", "600"))
DATABASE_URL: str = os.getenv("DATABASE_URL", "")


def decode_switchbot_meter(service_data: bytes) -> dict | None:
    if len(service_data) < 6:
        return None

    battery = service_data[2] & 0x7F
    temp_decimal = (service_data[3] & 0x0F) / 10.0
    temp_int = service_data[4] & 0x7F
    temp_sign = 1 if (service_data[4] & 0x80) else -1
    temperature = (temp_int + temp_decimal) * temp_sign
    humidity = service_data[5] & 0x7F

    # check if plausible values
    if not (-40 <= temperature <= 60):
        return None
    if not (0 <= humidity <= 100):
        return None
    if not (0 <= battery <= 100):
        return None

    return {
        "temperature": temperature,
        "humidity": humidity,
        "battery": battery,
    }


async def save_readings(readings: dict[str, dict]):
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        try:
            now = datetime.now(timezone.utc)
            for mac, data in readings.items():
                # Device upsert if not yet existing
                await conn.execute(
                    """
                    INSERT INTO devices (mac, name)
                    VALUES ($1, $2)
                    ON CONFLICT (mac) DO NOTHING
                """,
                    mac,
                    data["name"],
                )

                # insert reading
                await conn.execute(
                    """
                    INSERT INTO readings (device_mac, temperature, humidity, battery, timestamp)
                    VALUES ($1, $2, $3, $4, $5)
                """,
                    mac,
                    data["temperature"],
                    data["humidity"],
                    data["battery"],
                    now,
                )

                log.info(
                    f"[{data['name']}] ({mac}) saved | "
                    f"Temp: {data['temperature']:.1f}°C | "
                    f"Humidity: {data['humidity']}% | "
                    f"Battery: {data['battery']}%"
                )
        finally:
            await conn.close()
    except Exception as e:
        log.error(f"Failed to save readings: {e}")


async def scan() -> dict[str, dict]:
    """
    scan for 10sec returns last update.
    """
    collected: dict[str, dict] = {}

    def callback(device, advertisement_data):
        mac = device.address.upper()
        if mac not in DEVICES:
            return
        for _, data in advertisement_data.service_data.items():
            result = decode_switchbot_meter(data)
            if result:
                collected[mac] = {**result, "name": DEVICES[mac]}

    log.info(f"Scanning for {len(DEVICES)} device(s)...")
    scanner = BleakScanner(callback, scanning_mode="active")
    async with scanner:
        await asyncio.sleep(10.0)

    return collected


async def main():
    if not DEVICES:
        log.error("No devices configured. Set BLE_DEVICES in .env")
        return

    if not DATABASE_URL:
        log.error("No DATABASE_URL configured.")
        return

    log.info(f"Devices: {list(DEVICES.values())}")
    log.info(f"Scan interval: {SCAN_INTERVAL}s")

    while True:
        readings = await scan()

        if not readings:
            log.warning("No devices found in this scan.")
        else:
            await save_readings(readings)

        log.info(f"Next scan in {SCAN_INTERVAL}s...")
        await asyncio.sleep(SCAN_INTERVAL)


asyncio.run(main())
