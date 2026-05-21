-- Run once in Vercel Postgres / Neon SQL editor (Storage → Query)

CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL,
  data JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_quiz_id ON attempts (quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_completed_at ON attempts (completed_at DESC);
