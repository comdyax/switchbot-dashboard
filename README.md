# Home Climate Monitor

A self-hosted monitoring dashboard that reads temperature and humidity from **SwitchBot Meter Plus**
sensors over Bluetooth Low Energy and visualizes them in a web UI.

## Architecture

```
BLE Scanner → PostgreSQL → FastAPI Backend → React Frontend
```

- **BLE Scanner** — standalone service that scans for advertisements from the
  configured sensors, decodes them, and writes readings directly to PostgreSQL.
- **PostgreSQL** — stores devices and their time-series readings.
- **Backend** — FastAPI REST API over the database.
- **Frontend** — React + Vite dashboard, built and served by its own nginx
  container, which also reverse-proxies `/api` to the backend.

Each piece runs as its own container, wired together by Docker Compose.

## Quickstart

```bash
cp .env.example .env      # then edit values — at minimum BLE_DEVICES + DB creds
docker compose up -d --build
```

Then open the dashboard at **http://localhost:8080** (or `FRONTEND_PORT`).

| Service     | URL / Port                                  |
| ----------- | ------------------------------------------- |
| Frontend    | http://localhost:8080                       |
| Backend API | http://localhost:8000 (`/docs` for OpenAPI) |
| PostgreSQL  | `POSTGRES_BIND_IP`:5432                     |

> **Bluetooth:** the scanner runs with `network_mode: host` and needs access to
> the host's Bluetooth adapter. This realistically requires a Linux host with
> BlueZ. See [`ble-scanner/README.md`](ble-scanner/README.md).

## Configuration

All services read a single root `.env`. Copy [`.env.example`](.env.example),
which documents every variable, grouped by service.

## Per-service docs

| Service     | README                                           | What it covers                           |
| ----------- | ------------------------------------------------ | ---------------------------------------- |
| BLE Scanner | [`ble-scanner/README.md`](ble-scanner/README.md) | Decoding, Bluetooth requirements, tuning |
| Backend     | [`backend/README.md`](backend/README.md)         | API endpoints, local dev, tests          |
| Frontend    | [`frontend/README.md`](frontend/README.md)       | Build & dev commands, API proxy          |

## Repository layout

```
/
├── ble-scanner/      # BLE scan loop + SwitchBot decoder → PostgreSQL
├── backend/          # FastAPI REST API
├── frontend/         # React + Vite dashboard (served via nginx)
├── db/init.sql       # Initial schema, runs once on first DB start
├── docker-compose.yaml
├── Makefile          # Common dev commands (run `make help`)
├── .env.example      # Documented config template
└── .devcontainer/    # VS Code DevContainer
```

## Development

`make help` lists the available targets (backend install / test / dev). Each
service README covers running that piece on its own.
