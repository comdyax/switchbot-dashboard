# BLE Scanner

Standalone service that scans for Bluetooth Low Energy advertisements from the
configured SwitchBot Meter Plus sensors, decodes temperature/humidity/battery,
and writes readings directly to PostgreSQL.

It is a single loop (`scanner.py`): scan ~10s
keep the latest advertisement per known device, upsert the device row, insert a
reading, then sleep `BLE_SCAN_INTERVAL` and repeat. See the root
[`README.md`](../README.md) for how it fits with the other services.

## Bluetooth requirements

- A **Linux host with BlueZ** and a working Bluetooth adapter.
- The container runs with `network_mode: host`, mounts `/var/run/dbus`, and adds
  the `NET_ADMIN` / `NET_RAW` capabilities so Bleak can talk to BlueZ over D-Bus.
- Sensors advertise passively — no pairing needed. They just have to be in range.

## Configuration

Reads from the root `.env` (see [`.env.example`](../.env.example)):

| Variable            | Required | Default | Purpose                                                                     |
| ------------------- | -------- | ------- | --------------------------------------------------------------------------- |
| `BLE_DEVICES`       | yes      | `{}`    | JSON map of **uppercase** MAC → display name. Only these MACs are recorded. |
| `BLE_SCAN_INTERVAL` | no       | `600`   | Seconds between scan cycles.                                                |
| `DATABASE_URL`      | yes      | —       | `postgresql://user:pass@host:5432/db` (plain asyncpg DSN).                  |

The scanner only records MACs listed in `BLE_DEVICES`; unknown devices in range
are ignored. If it stays empty, the service logs an error and exits.

## Running

Via Compose (normal path), from the repo root:

```bash
docker compose up -d --build ble-scanner
docker compose logs -f ble-scanner
```

Standalone (for debugging on a Bluetooth-capable Linux host):

```bash
cd ble-scanner
pip install -r requirements.txt
# Set BLE_DEVICES and DATABASE_URL (e.g. in the root .env)
python3 scanner.py
```

A successful cycle logs one line per sensor, e.g.:

```
[Room 1] (E1:23:45:67:89:AB) saved | Temp: 21.4°C | Humidity: 48% | Battery: 97%
```

## Decoding notes

`decode_switchbot_meter()` parses the SwitchBot Meter service data: battery in
byte 2, temperature across bytes 3–4 (sign bit in the high bit of byte 4),
humidity in byte 5. Readings outside plausible ranges
(temp −40…60 °C, humidity 0…100 %, battery 0…100 %) are discarded as garbage.
