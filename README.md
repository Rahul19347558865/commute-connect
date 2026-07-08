# Commute Connect 🚗

A premium full-stack carpooling and ride-sharing web application designed for daily commuting, matching passengers and drivers going to similar offices or colleges.

## Key Features

1. **Secure Autocomplete Matching:** Driver routes matching based on Leaflet mapping, OSRM routing metrics, and address lookup via Nominatim geocoding.
2. **Real-time GPS Tracking:** Real-time driver coordinates streaming directly onto passengers' map views via Supabase websocket changes channels.
3. **In-App Messaging Chat:** Participant communication channels with push notifications logic.
4. **Moderation & Audits Console:** Full admin overview dashboard statistics, user suspensions toggling, and reports queue moderation panel.
5. **PWA Standalone Shell:** Offline service worker caching policies with custom manifest parameters for mobile devices installs.

## Tech Stack

* **Frontend:** React SPA, Vite, TypeScript, React Query (TanStack), Leaflet maps.
* **Backend:** Express.js, TypeScript, Supabase JS SDK, JWT verify middlewares.
* **Database:** PostgreSQL, Supabase Row-Level Security (RLS) policies.

---

## Launching with Docker Compose

Ensure docker is installed, and you copy `.env.example` values to a local `.env` root configuration file. Then launch:

```bash
docker-compose up --build -d
```

* **Frontend portal:** runs on `http://localhost` (Port 80)
* **Backend REST API:** runs on `http://localhost:5000`

---

## Manual Local Development Setup

### 1. Database Setup
Register the database schema definitions inside your Supabase SQL editor using the script at:
[`backend/src/config/schema.sql`](file:///c:/Users/ASUS/OneDrive/Desktop/Projects/commute-connect/backend/src/config/schema.sql)

### 2. Backend Server launch
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Web launch
```bash
cd frontend
npm install
npm run dev
```
Matches local client execution at `http://localhost:5173`.