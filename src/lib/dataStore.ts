import type { ExportPayload } from '../types/export';
import type { Quiz, QuizAttempt } from '../types/quiz';
import * as api from './apiClient';
import { getDataMode, requireDatabase, useDatabaseOnly } from './dataMode';
import * as local from './storage';

async function ensureApiReady(): Promise<void> {
  if (useDatabaseOnly()) {
    await requireDatabase();
    return;
  }
  const mode = await getDataMode();
  if (mode !== 'api') {
    throw new Error(
      'Database mode is required. Set VITE_USE_API=true or run with vercel dev.'
    );
  }
}

export async function loadQuizzes(): Promise<Quiz[]> {
  if (useDatabaseOnly()) {
    await requireDatabase();
    return api.fetchQuizzes();
  }
  const mode = await getDataMode();
  if (mode === 'api') return api.fetchQuizzes();
  return local.getQuizzes();
}

export async function loadQuizById(id: string): Promise<Quiz | undefined> {
  const quizzes = await loadQuizzes();
  return quizzes.find((q) => q.id === id);
}

export async function persistQuiz(quiz: Quiz): Promise<void> {
  await ensureApiReady();
  await api.saveQuiz(quiz);
}

export async function removeQuiz(id: string): Promise<void> {
  await ensureApiReady();
  await api.deleteQuizApi(id);
}

export async function loadAttempts(): Promise<QuizAttempt[]> {
  if (useDatabaseOnly()) {
    await requireDatabase();
    return api.fetchAttempts();
  }
  const mode = await getDataMode();
  if (mode === 'api') return api.fetchAttempts();
  return local.getAttempts();
}

export async function persistAttempt(attempt: QuizAttempt): Promise<void> {
  if (useDatabaseOnly()) {
    await requireDatabase();
    await api.saveAttemptApi(attempt);
    return;
  }
  const mode = await getDataMode();
  if (mode === 'api') {
    await api.saveAttemptApi(attempt);
    return;
  }
  local.saveAttempt(attempt);
}

export function getBestScoreForQuiz(
  quizId: string,
  attempts: QuizAttempt[]
): number | null {
  const forQuiz = attempts.filter((a) => a.quizId === quizId);
  if (forQuiz.length === 0) return null;
  return Math.max(...forQuiz.map((a) => a.score));
}

export async function exportAll(): Promise<void> {
  await ensureApiReady();
  await api.downloadExport();
}

export async function importAll(payload: ExportPayload): Promise<void> {
  await ensureApiReady();
  await api.importData(payload);
}
