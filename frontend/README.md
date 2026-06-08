# Frontend

React + [Vite](https://vite.dev/) dashboard that visualizes the data.
Built to static files and served by nginx in its own container. See the root
[`README.md`](../README.md) for the big picture.

Stack: React 19, Recharts for the time charts, Vite as
the build tool/dev server.

## API access

The app calls the backend under `/api`.

- **Dev** — Vite's dev server proxies `/api` → `http://localhost:8000`
  (`vite.config.js`).
- **Production** — nginx serves the built bundle and reverse-proxies `/api` →
  the `backend` service over the Compose network (`nginx.conf`).

## Development

```bash
cd frontend
npm install
npm run dev       # Vite dev server on http://localhost:5173
```

Other scripts:

```bash
npm run build     # produce the static bundle in dist/
npm run preview   # serve the built bundle locally
npm run lint      # ESLint
```

## Production build (Docker)

The multi-stage `Dockerfile` builds the bundle with Node, then copies `dist/`
into an nginx image. Built and run by Compose as the `frontend` service,
published on `FRONTEND_PORT` (default `8080`):

```bash
docker compose up -d --build frontend
```

## Layout

```
src/
├── main.jsx                 # App entry
├── App.jsx                  # Root component
├── api.js                   # Backend REST client (fetches /api/...)
├── rooms.js                 # Room/sensor display config
├── format.js                # Value/label formatting helpers
├── components/              # DashboardView, ReadingCard, SwitchbotReadingsGrid,
│                            #   TimeChart, ChartControls, DateRangePicker,
│                            #   Tile, StatusPill, Toggle
├── context/                 # SensorsContext, HistoryContext
└── hooks/                   # useHistories
```
