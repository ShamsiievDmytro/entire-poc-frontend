# entire-poc-frontend
React dashboard for the Entire IO Pattern C validation PoC. Visualizes AI session metrics ingested by the backend.
I am superman
## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Opens at `http://localhost:5173`. Expects the backend running on `http://localhost:3001`.

## Build

```bash
npm run build
npm run preview
```

## Features

- **6 charts**: Sessions Over Time, Agent % per Commit, Slash Commands, Tool Usage, Friction, Open Items
- **Cross-Repo Session Map**: Table showing sessions, repos touched, linked commits, and confidence flags
- **Ingestion Status**: Last run, repo coverage, session/checkpoint/link counts
- **Refresh button**: Triggers backend re-ingestion

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE` | `http://localhost:3001` | Backend API base URL |
