# Marvel Rivals Stat Viewer

A full-stack dashboard for searching and visualizing Marvel Rivals player performance data.

The app provides:

- Player profile and rank info
- Peak rank history by season
- Overall performance metrics (wins, K/D, KDA, MVP rate, per-minute stats)
- Hero-level breakdown
- Role-level breakdown

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Usage (How Each Tool Is Used Here)](#technology-usage-how-each-tool-is-used-here)
- [Implementation Snippets](#implementation-snippets)
- [Data Flow](#data-flow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Backend API](#backend-api)
- [Future Improvements](#future-improvements)

## Overview

This project is structured as a React + TypeScript frontend with an ASP.NET Core backend.

The frontend currently performs player lookups directly through the `mrivals` package. The backend includes a lightweight proxy endpoint that can be used when you want server-side mediation (for example, request shaping, rate-limit controls, or centralized logging).

## Architecture

```text
Browser
  |
  v
React + TypeScript frontend (Vite)
  |                          \
  | direct lookup             \ optional proxy path
  v                            v
mrivals API client         ASP.NET Core Minimal API
                                 |
                                 v
                   https://mrivals.vercel.app/player/{username}
```

## Technology Usage (How Each Tool Is Used Here)

### Frontend

- React 18
  - Used to build a state-driven single-page dashboard with tabbed views (`info`, `overview`, `heroes`, `roles`).

- TypeScript
  - Used across frontend source for safer component/state logic and better editor support.

- Vite
  - Used as the dev server and build pipeline.
  - Configured with React plugin, shared `public` directory, and port `3000`.

- Tailwind CSS
  - Used for nearly all styling directly in JSX (`bg-slate-*`, `text-*`, spacing, layout, responsive grids).

- `mrivals`
  - Used as the player stats client: `API.fetchUser(username)` returns a user object that is transformed into section-specific data (`info`, `peakRank`, `overview`, `heroes`, `roles`).

- `lucide-react`
  - Used for visual iconography in stat cards, tabs, and headers.

### Backend

- ASP.NET Core Minimal API (.NET 8)
  - Hosts two simple endpoints:
    - `GET /` health status
    - `GET /api/player/{username}` proxy endpoint

- `HttpClient` from DI
  - Registered with `builder.Services.AddHttpClient()` and injected into the route handler for outbound requests.

- CORS
  - Default permissive policy enabled to simplify local development and cross-origin requests.

## Implementation Snippets

### 1) Frontend player fetch + state fan-out (`frontend/src/App.tsx`)

```tsx
const user = await API.fetchUser(username);

setPlayerInfo(user.info());
setPeakRanks(user.peakRank());
setOverview(user.overview());
setHeroes(user.heroes());
setRoles(user.roles());
```

This single fetch drives all tabs without additional network requests.

### 2) Backend proxy endpoint (`backend/Program.cs`)

```csharp
app.MapGet("/api/player/{username}", async (string username, HttpClient http) =>
{
    var response = await http.GetAsync($"https://mrivals.vercel.app/player/{username}");
    if (!response.IsSuccessStatusCode)
        return Results.NotFound(new { error = "Player not found" });

    var content = await response.Content.ReadAsStringAsync();
    var data = JsonSerializer.Deserialize<JsonElement>(content);
    return Results.Ok(data);
});
```

This keeps a server-side integration point available without forcing the frontend to use it today.

### 3) Vite config with shared public assets (`frontend/vite.config.ts`)

```ts
export default defineConfig({
  plugins: [react()],
  publicDir: '../public',
  server: {
    port: 3000,
    host: '0.0.0.0',
  }
})
```

This enables static assets in the root `public` folder (such as background images) to be served by the frontend app.

## Data Flow

1. User enters a username and triggers search.
2. Frontend resets current data and sets loading state.
3. Frontend calls `API.fetchUser(username)`.
4. Response is split into separate sections:
   - `info()`
   - `peakRank()`
   - `overview()`
   - `heroes()`
   - `roles()`
5. UI renders section tabs from in-memory state.
6. Any lookup failure is shown as a user-facing error message.

Optional backend path:

1. Client calls `GET /api/player/{username}`.
2. Backend forwards to external endpoint.
3. Backend returns normalized JSON/error response.

## Project Structure

```text
Marvel-Rivals-Stat-Viewer/
  backend/
    Backend.csproj
    Program.cs
  frontend/
    src/
      App.tsx
      main.tsx
      index.css
    package.json
    vite.config.ts
    tsconfig.json
    tailwind.config.js
    postcss.config.js
  public/
  package.json
  MarvelRivalsTracker.sln
```

## Getting Started

### Prerequisites

- Node.js 18+
- .NET 8 SDK

### Install dependencies

From repository root:

```bash
npm run install:all
```

### Run locally

Use two terminals from repository root.

Terminal 1 (frontend):

```bash
npm run dev
```

Terminal 2 (backend):

```bash
npm run backend
```

Default local endpoints:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Available Scripts

Root `package.json`:

- `npm run install:all`  
  Installs frontend dependencies and restores backend packages via solution restore.

- `npm run dev`  
  Runs frontend dev server (`vite`) from `frontend`.

- `npm run build`  
  Runs frontend TypeScript compile + production build.

- `npm run preview`  
  Serves the built frontend bundle for preview.

- `npm run backend`  
  Runs the ASP.NET Core backend project.

## Backend API

- `GET /`  
  Health/status response.

- `GET /api/player/{username}`  
  Optional proxy endpoint to fetch player stats from the upstream source.

## Future Improvements

- Split `App.tsx` into feature-focused components (`PlayerHeader`, `OverviewTab`, `HeroStatsTab`, `RoleStatsTab`)
- Replace remaining `any` types with explicit interfaces
- Add backend resiliency (cache, retry/backoff, structured logging)
- Add automated tests for frontend views and backend endpoint behavior
- Add deployment and environment configuration documentation
