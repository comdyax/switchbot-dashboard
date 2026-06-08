# Backend

FastAPI REST API over the PostgreSQL database, using SQLAlchemy's async engine
(asyncpg).

## API

Interactive docs are served at `/docs` (Swagger) and `/redoc` when the app is
running. Summary:

| Method | Path                         | Description                                                         |
| ------ | ---------------------------- | ------------------------------------------------------------------- |
| GET    | `/health`                    | Liveness check; runs `SELECT 1` against the DB.                     |
| GET    | `/api/sensors`               | All devices with their latest reading — powers the dashboard cards. |
| GET    | `/api/sensors/{mac}/latest`  | Most recent reading for one device. `404` if it has none.           |
| GET    | `/api/sensors/{mac}/history` | Time-bucketed aggregation for charts.                               |

### History query params

`GET /api/sensors/{mac}/history`

- `interval` — bucket size: `minute` \| `hour` \| `day` \| `week` \| `month` (default `hour`).
- `start`, `end` — ISO timestamps. Default window is the **last 24 hours**.
  `start` must be before `end` (else `400`); unknown MAC → `404`.

Each point carries avg/min/max for both temperature and humidity over the bucket.

## Configuration

Reads from the root `.env` (see [`.env.example`](../.env.example)):

| Variable       | Required | Default                 | Purpose                                                                                                               |
| -------------- | -------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | yes      | —                       | Postgres DSN. A `postgresql://` URL is auto-rewritten to use the asyncpg driver.                                      |
| `CORS_ORIGINS` | no       | `http://localhost:5173` | Comma-separated allowed origins. Only needed for the Vite dev server; in production nginx proxies `/api` same-origin. |

## Local development

From the repo root (uses the `Makefile`):

```bash
make install-backend   # pip install -r requirements-dev.txt
make dev-backend       # uvicorn app.main:app --reload on 0.0.0.0:8000
make test-backend      # pytest
```

Or directly inside `backend/`:

```bash
pip install -r requirements-dev.txt
python -m uvicorn app.main:app --reload --port 8000
python -m pytest
```

## Layout

```
app/
├── main.py                       # FastAPI app, CORS, /health, router wiring
├── config.py                     # pydantic-settings (typed config from .env)
├── database.py                   # async engine + get_session dependency
├── models.py                     # SQLAlchemy ORM models (devices, readings)
├── schemas.py                    # Pydantic response models
├── crud.py                       # Query / aggregation logic
└── routers/switchbot_sensors.py  # /api/sensors endpoints
tests/                            # pytest suite
```
