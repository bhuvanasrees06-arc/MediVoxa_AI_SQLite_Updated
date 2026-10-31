# MediVoxa AI Prototype Starter

This project contains a React/Vite frontend and an Express backend. The backend now uses **SQLite**; PostgreSQL is not required.

## Requirements

- Node.js 20 or newer (recommended)
- npm

## 1. Configure the backend

Open a terminal in the project folder:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Open `backend/.env`. A Gemini API key is optional for starting the server, but the AI chat endpoint will return a configuration message until you add your own key. Keep the key private.

## 2. Start the backend

From the `backend` folder:

```powershell
npm run dev
```

The API runs at `http://localhost:5000`. The SQLite database is created automatically at `backend/data/medivoxa.sqlite` on first startup. You do not need to run SQL manually or install a database server.

Check `http://localhost:5000/api/health`; it should return:

```json
{"ok":true,"service":"MediVoxa AI API"}
```

## 3. Start the frontend

Open a **second terminal** at the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API notes

- `POST /api/chat` — Gemini-powered general health information (requires a Gemini API key).
- `POST /api/skin/analyze` — accepts an image but does not claim a diagnosis until a validated skin model is connected.
- `POST /api/medicine/analyze` — accepts an image but does not identify pills until OCR and a trusted medicine reference are connected.
- `/api/health-records` — stores blood pressure, blood sugar, and weight records in SQLite.
- `/api/reminders` — stores medication reminder entries in SQLite. This stores reminder schedules; SMS/voice delivery requires a separate notification provider integration.

## Database location

`backend/data/medivoxa.sqlite`

The `data` folder is generated automatically and should not be committed to Git. To reset the local prototype database, stop the backend and delete this file; the tables will be recreated on the next startup. Deleting it permanently deletes the local records.
