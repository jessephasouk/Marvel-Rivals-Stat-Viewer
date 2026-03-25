# Marvel Rivals Stat Viewer

A full-stack project for searching and visualizing Marvel Rivals player performance data.

This repository is intentionally designed as an interview-friendly engineering project: it demonstrates UI composition, asynchronous data access, API integration strategy, and practical architecture trade-offs between direct API usage and a backend proxy.

## Table of Contents

- [1) Project Overview](#1-project-overview)
- [2) Architecture at a Glance](#2-architecture-at-a-glance)
- [3) Tech Stack and Why Each Technology Was Chosen](#3-tech-stack-and-why-each-technology-was-chosen)
- [4) Key Design Decisions and Trade-offs](#4-key-design-decisions-and-trade-offs)
- [5) Data Flow](#5-data-flow)
- [6) Project Structure](#6-project-structure)
- [7) Getting Started](#7-getting-started)
- [8) Scripts](#8-scripts)
- [9) API Surface](#9-api-surface)
- [10) Interview Walkthrough Talking Points](#10-interview-walkthrough-talking-points)
- [11) Future Improvements](#11-future-improvements)

## 1) Project Overview

The application allows a user to enter a Marvel Rivals username and view:

- Player profile and rank information
- Peak rank history across seasons
- Overall gameplay metrics (wins, K/D, KDA, MVP rate, per-minute metrics)
- Hero-level performance breakdown
- Role-level performance breakdown

The frontend is built for fast iteration and responsive UI rendering.  
The backend is a .NET 8 Minimal API service that currently exposes a health endpoint and an optional proxy endpoint for player lookups.

## 2) Architecture at a Glance

```text
User Browser
    |
    v
React + TypeScript frontend (Vite)
    |                         \
    | direct integration       \ optional proxy path
    v                           v
mrivals package/API          ASP.NET Core Minimal API
                                  |
                                  v
                         External stats endpoint
                         https://mrivals.vercel.app/player/{username}
```

### Current operational model

- Primary path in the UI: direct data fetch through `mrivals` (`API.fetchUser(...)`)
- Secondary path: backend proxy endpoint available for extension, CORS mediation, or future auth/rate-limit logic

## 3) Tech Stack and Why Each Technology Was Chosen

### Frontend

- React 18
  - Chosen for component-driven UI, predictable state updates, and strong ecosystem support.
- TypeScript
  - Adds compile-time safety and improves confidence when evolving UI logic and data contracts.
- Vite
  - Fast startup and rebuild times for better development feedback loops.
- Tailwind CSS
  - Utility-first styling for rapid, consistent visual iteration without large custom CSS files.
- `lucide-react`
  - Lightweight icon set that keeps stat cards and sections visually scannable.
- `mrivals`
  - Domain-specific library that provides typed access patterns for player data retrieval and structured stats methods.

### Backend

- ASP.NET Core (.NET 8) Minimal API
  - Keeps the API surface small and clear for lightweight endpoints.
  - Easy to extend into richer service layers when needed.
- `HttpClient` via dependency injection
  - Follows recommended .NET resource management patterns instead of ad hoc client creation.

## 4) Key Design Decisions and Trade-offs

### Decision: Keep frontend and backend decoupled

- Why:
  - UI can evolve independently from backend API shape.
  - Backend remains optional in the current version.
- Trade-off:
  - Two integration paths exist (direct + proxy), so documentation and consistency matter.

### Decision: Single-page, state-driven dashboard in one core component

- Why:
  - Fast to build and easy to demonstrate end-to-end flow in an interview.
  - All view tabs (info, overview, heroes, roles) share the same fetched player state.
- Trade-off:
  - `App.tsx` is currently large; future refactors should split into feature components and typed domain models.

### Decision: Utility-first styling with Tailwind

- Why:
  - Rapid UI iteration and consistent design language.
- Trade-off:
  - Class-heavy JSX can be verbose; component extraction helps long-term maintainability.

### Decision: Minimal backend surface first

- Why:
  - Avoids over-engineering before requirements require additional API orchestration.
- Trade-off:
  - Advanced production concerns (caching, retries, auth, rate limiting, observability) are intentionally deferred.

## 5) Data Flow

1. User enters a username and triggers search.
2. Frontend sets loading state and clears previous player data.
3. Frontend calls `API.fetchUser(username)` from `mrivals`.
4. The returned user object is transformed into view models:
   - `info()`
   - `peakRank()`
   - `overview()`
   - `heroes()`
   - `roles()`
5. UI renders tabbed statistical views from in-memory state.
6. Errors are surfaced in the UI with a clear message.

Backend proxy flow (optional):

1. Client calls `GET /api/player/{username}` on local backend.
2. Backend forwards request to external stats endpoint.
3. Backend returns normalized success or error response.

## 6) Project Structure

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
    (shared static assets used by frontend)
  package.json              # root workspace scripts
  MarvelRivalsTracker.sln
```

## 7) Getting Started

### Prerequisites

- Git
- Node.js 18+
- .NET 8 SDK

### Install dependencies

From repository root:

```bash
npm run install:all
```

This installs frontend npm packages and restores backend NuGet packages through the solution.

### Run locally (development)

Use two terminals from repository root.

Terminal 1 (frontend):

```bash
npm run dev
```

Terminal 2 (backend):

```bash
npm run backend
```

Default endpoints:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## 8) Scripts

Root `package.json` scripts:

- `npm run install:all`  
  Installs frontend dependencies and runs `dotnet restore` for the solution.
- `npm run dev`  
  Starts Vite dev server from `frontend`.
- `npm run build`  
  Runs frontend TypeScript compilation and production build.
- `npm run preview`  
  Previews the built frontend bundle.
- `npm run backend`  
  Runs ASP.NET Core backend project.

## 9) API Surface

Backend endpoints:

- `GET /`  
  Health check endpoint returning a simple status string.

- `GET /api/player/{username}`  
  Optional proxy endpoint that forwards player lookup to the external stats source.

## 10) Interview Walkthrough Talking Points

Use this sequence when explaining the project to technical interviewers:

1. Problem framing
   - “I wanted a practical full-stack dashboard that consumes real player-performance data and presents it in a way that supports fast comparison and insight.”

2. Architecture rationale
   - “I used React + TypeScript for fast, safe frontend iteration, and a .NET 8 Minimal API backend as an extension point for API mediation and production concerns.”

3. Data modeling and UI
   - “After one user fetch, I partition data into profile, peak rank, overview, hero stats, and role stats so each view can render independently without repeated network calls.”

4. Trade-offs and next steps
   - “I optimized for clarity and delivery speed first. Next refactor would split `App.tsx` into typed feature modules and add server-side caching plus request controls.”

5. Engineering maturity
   - “The project already demonstrates layered architecture potential, DI usage in backend, strict TypeScript mode, and repeatable root-level workflows.”

## 11) Future Improvements

- Refactor large frontend component into:
  - `PlayerHeader`
  - `OverviewTab`
  - `HeroStatsTab`
  - `RoleStatsTab`
- Replace `any` state types with explicit interfaces for stronger contract safety.
- Add backend resiliency features:
  - Response caching
  - Retry/backoff strategy for upstream calls
  - Structured logging and observability
- Add automated tests:
  - Frontend component tests for tab rendering and error states
  - Backend endpoint tests for proxy behavior and failure paths
- Add deployment docs and environment variable strategy for production hosting.
