# MCQ Test Website

A multiple-choice quiz app built with Vite, React, and TypeScript. Browse quizzes by category, take timed tests, review scores, and manage content from an admin portal.

Data can run in **localStorage** (local dev) or **Vercel Postgres** (production) with JSON export/import.

## Features

- Take quizzes one question at a time with a countdown timer
- Score and answer review after each attempt
- Category filter on the home page
- Attempt history
- Admin portal with login, CRUD for quizzes/questions, JSON bulk import for questions, export/import JSON

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
3. **Settings → Environment Variables** (enable for **Production**):
   - `ADMIN_PASSWORD` — admin login password (server-side)
   - `SESSION_SECRET` — random string for session cookies
4. **Redeploy** after adding storage or env vars.

Tables are created on first API request; sample quizzes seed if empty.

Optional: run `scripts/schema.sql` in the Postgres SQL editor for explicit schema setup.

### Verify production uses the database

1. Open `https://YOUR-APP.vercel.app/api/health` — expect `{"ok":true,"database":true}`.
2. Open **Admin Portal** — banner should say **Database (Vercel Postgres)**. If it says **Browser only (localStorage)**, Postgres is not connected; saves will not appear in SQL.
3. After **Save quiz**, check Network tab: `PUT /api/quizzes` should return **200**.
4. In Neon/Vercel SQL: `SELECT id, data->>'title' AS title FROM quizzes;`

### Troubleshooting: changes not in database

| Symptom | Fix |
|---------|-----|
| `/api/health` shows `"database":false` | Link Postgres storage to the project; redeploy |
| Admin banner says localStorage | Same as above; or run `vercel dev` locally with env pulled |
| `PUT /api/quizzes` returns 401 | Log in at `/admin/login` with `ADMIN_PASSWORD` |
| UI shows data but SQL empty | Data is in your browser only — connect DB and save again |
| Env vars added but no change | Redeploy production after changing variables |

## Admin portal

- URL: `/admin` (redirects to `/admin/login` if not signed in)
- Default password: `admin` (change via `ADMIN_PASSWORD` on Vercel)
- **Export JSON** — download all quizzes and attempts
- **Import JSON** — replace all data from a previous export
- **Add questions from JSON** — paste question object(s) while editing a quiz (append or replace)

### Question JSON format

```json
[
  {
    "text": "Which keyword declares a block-scoped variable?",
    "options": ["var", "let", "function", "const"],
    "correctIndex": 1
  }
]
```

Also accepts a single question object or `{ "questions": [...] }`. Optional `id` per question; otherwise IDs are generated automatically.

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
