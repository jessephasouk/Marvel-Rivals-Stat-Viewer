# Marvel Rivals Stat Viewer

A full-stack app for viewing Marvel Rivals player stats.

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: ASP.NET Core (.NET 8 minimal API)

## Prerequisites (Install These First)

- Git
- Node.js 18+ (includes npm)
- .NET 8 SDK

## Clean Project Structure

```text
Marvel-Rivals-Stat-Viewer/
  backend/                 # ASP.NET Core API
  frontend/                # React + Vite app
    src/
    index.html
    package.json
  public/                  # Shared static assets (used by frontend)
  package.json             # Root workspace scripts
  MarvelRivalsTracker.sln
```

## Installation

From the repository root:

```bash
npm run install:all
```

This installs frontend packages and restores backend NuGet packages.

## Run in Development

Use two terminals in the repo root.

Terminal 1 (frontend):

```bash
npm run dev
```

Terminal 2 (backend):

```bash
npm run backend
```

- Frontend (Vite): usually `http://localhost:3000`
- Backend: `http://localhost:5000`

## Build

From repo root:

```bash
npm run build
dotnet build .\backend\Backend.csproj
```

## Root Scripts

- `npm run install:all` - Install frontend deps + restore backend
- `npm run dev` - Run frontend dev server (`frontend`)
- `npm run build` - Build frontend (`frontend`)
- `npm run preview` - Preview frontend build (`frontend`)
- `npm run backend` - Run backend API
