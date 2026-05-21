# MCQ Test Website

A client-side multiple-choice quiz app built with Vite, React, and TypeScript. Browse quizzes by category, take timed tests, review scores, and manage questions from an in-browser admin panel.

## Features

- **Take quizzes** — One question at a time with next/previous navigation
- **Timer** — Per-quiz countdown; auto-submit when time runs out
- **Score & review** — See correct/incorrect answers after each attempt
- **Categories** — Filter quizzes on the home page
- **History** — Past attempts stored in the browser
- **Admin** — Create, edit, and delete quizzes and questions (no login)

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Data storage

All quizzes and attempt history are saved in **localStorage** under keys `mcq_quizzes` and `mcq_attempts`. Data stays on your device and is not sent to any server.

On first visit, three sample quizzes (JavaScript, React, Math) are seeded automatically.

## Admin Portal

Open **Admin Portal** in the nav (`/admin`). You must sign in with the admin password first.

1. Sign in at `/admin/login` (default password: `admin`)
2. Create a quiz (title, category, time limit)
3. Add questions and answer options (2–6 options per question)
4. Mark the correct answer with the radio button
5. Save — the quiz appears on the home page

### Change the admin password

Create a `.env` file in the project root (see `.env.example`):

```
VITE_ADMIN_PASSWORD=your-secure-password
```

Restart the dev server after changing `.env`. Sessions are stored in `sessionStorage` and clear when you close the browser tab.

**Note:** This is client-side protection only—the password is embedded in the frontend bundle. Use for casual/local use, not production secrets.

## Tech stack

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- TypeScript
