# MCQ Test Website

A multiple-choice quiz app built with Vite, React, and TypeScript. Browse quizzes by category, take timed tests, review scores, and manage content from an admin portal.

Data can run in **localStorage** (local dev) or **Vercel Postgres** (production) with JSON export/import.

## Features

- Take quizzes one question at a time with a countdown timer
- Score and answer review after each attempt
- Category filter on the home page
- Attempt history
- Admin portal with login, CRUD for quizzes/questions, export/import JSON

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Without a database, the app uses **localStorage** and seeds sample quizzes automatically.

### Full stack locally (API + Postgres)

1. Install [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
2. Link the project: `vercel link`
3. Add Vercel Postgres in the dashboard, then pull env: `vercel env pull .env.local`
4. Set `ADMIN_PASSWORD` in `.env.local`
5. Run: `npm run dev:full` (proxies `/api` to Vercel dev server)

Or use `npm run dev` only — API calls fall back to localStorage when `/api/health` reports no database.

## Deploy to Vercel

1. Push the repo to GitHub and import in [Vercel](https://vercel.com)
2. **Storage → Create Database → Postgres** (links `POSTGRES_URL` automatically)
3. **Settings → Environment Variables**:
   - `ADMIN_PASSWORD` — admin login password (server-side)
   - `SESSION_SECRET` — random string for session cookies
4. Deploy. Tables are created on first API request; sample quizzes seed if empty.

Optional: run `scripts/schema.sql` in the Postgres SQL editor for explicit schema setup.

## Admin portal

- URL: `/admin` (redirects to `/admin/login` if not signed in)
- Default password: `admin` (change via `ADMIN_PASSWORD` on Vercel)
- **Export JSON** — download all quizzes and attempts
- **Import JSON** — replace all data from a previous export

## Environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `ADMIN_PASSWORD` | Server (Vercel) | Admin login |
| `SESSION_SECRET` | Server | Sign session cookies |
| `POSTGRES_URL` | Server (auto) | Vercel Postgres connection |
| `VITE_USE_API` | Client (optional) | Force `true` or `false` for data mode |
| `VITE_ADMIN_PASSWORD` | Client (optional) | Local-only fallback login |

## API routes

| Route | Methods | Auth |
|-------|---------|------|
| `/api/health` | GET | — |
| `/api/quizzes` | GET, PUT, DELETE | PUT/DELETE require admin |
| `/api/attempts` | GET, POST | — |
| `/api/auth/login` | POST | — |
| `/api/auth/logout` | POST | — |
| `/api/auth/session` | GET | — |
| `/api/export` | GET | Admin |
| `/api/import` | POST | Admin |

## Tech stack

- Vite + React + TypeScript
- React Router
- Vercel Serverless Functions + Vercel Postgres
- localStorage fallback for offline/local dev
