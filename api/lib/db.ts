import { seedQuizzes } from './seed';
import { getSql, pingDatabase } from './postgres';

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  timeLimitMinutes: number;
  questions: Question[];
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  answers: Record<string, number>;
  score: number;
  total: number;
  startedAt: string;
  completedAt: string;
  timeSpentSeconds: number;
};

export type ExportPayload = {
  version: 1;
  exportedAt: string;
  quizzes: Quiz[];
  attempts: QuizAttempt[];
};

let tablesReady = false;

export async function isDatabaseAvailable(): Promise<boolean> {
  return pingDatabase();
}

export async function ensureTables(): Promise<void> {
  if (tablesReady) return;
  const sql = await getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      data JSONB NOT NULL,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  tablesReady = true;
}

async function seedIfEmpty(): Promise<void> {
  const sql = await getSql();
  const rows = await sql`SELECT COUNT(*)::int AS count FROM quizzes`;
  const count = Number(rows[0]?.count ?? 0);
  if (count > 0) return;

  for (const quiz of seedQuizzes) {
    await sql`
      INSERT INTO quizzes (id, data)
      VALUES (${quiz.id}, ${JSON.stringify(quiz)}::jsonb)
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function fetchAllQuizzes(): Promise<Quiz[]> {
  await ensureTables();
  await seedIfEmpty();
  const sql = await getSql();
  const rows = await sql`SELECT data FROM quizzes ORDER BY updated_at DESC`;
  return rows.map((r) => r.data as Quiz);
}

export async function upsertQuiz(quiz: Quiz): Promise<void> {
  await ensureTables();
  const sql = await getSql();
  await sql`
    INSERT INTO quizzes (id, data, updated_at)
    VALUES (${quiz.id}, ${JSON.stringify(quiz)}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = NOW()
  `;
}

export async function deleteQuiz(id: string): Promise<void> {
  await ensureTables();
  const sql = await getSql();
  await sql`DELETE FROM quizzes WHERE id = ${id}`;
}

export async function fetchAllAttempts(): Promise<QuizAttempt[]> {
  await ensureTables();
  const sql = await getSql();
  const rows = await sql`SELECT data FROM attempts ORDER BY completed_at DESC`;
  return rows.map((r) => r.data as QuizAttempt);
}

export async function insertAttempt(attempt: QuizAttempt): Promise<void> {
  await ensureTables();
  const sql = await getSql();
  await sql`
    INSERT INTO attempts (id, quiz_id, data, completed_at)
    VALUES (
      ${attempt.id},
      ${attempt.quizId},
      ${JSON.stringify(attempt)}::jsonb,
      ${attempt.completedAt}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function exportAll(): Promise<ExportPayload> {
  const [quizzes, attempts] = await Promise.all([
    fetchAllQuizzes(),
    fetchAllAttempts(),
  ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    quizzes,
    attempts,
  };
}

export async function importAll(payload: ExportPayload): Promise<void> {
  await ensureTables();
  const sql = await getSql();
  await sql`DELETE FROM attempts`;
  await sql`DELETE FROM quizzes`;

  for (const quiz of payload.quizzes) {
    await upsertQuiz(quiz);
  }
  for (const attempt of payload.attempts) {
    await insertAttempt(attempt);
  }
}
