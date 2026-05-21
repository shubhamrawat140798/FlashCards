import type { ExportPayload } from '../types/export';
import type { Quiz, QuizAttempt } from '../types/quiz';
import * as api from './apiClient';
import { getDataMode } from './dataMode';
import * as local from './storage';

export async function loadQuizzes(): Promise<Quiz[]> {
  const mode = await getDataMode();
  if (mode === 'api') return api.fetchQuizzes();
  return local.getQuizzes();
}

export async function loadQuizById(id: string): Promise<Quiz | undefined> {
  const quizzes = await loadQuizzes();
  return quizzes.find((q) => q.id === id);
}

export async function persistQuiz(quiz: Quiz): Promise<void> {
  const mode = await getDataMode();
  if (mode === 'api') {
    await api.saveQuiz(quiz);
    return;
  }
  local.upsertQuiz(quiz);
}

export async function removeQuiz(id: string): Promise<void> {
  const mode = await getDataMode();
  if (mode === 'api') {
    await api.deleteQuizApi(id);
    return;
  }
  local.deleteQuiz(id);
}

export async function loadAttempts(): Promise<QuizAttempt[]> {
  const mode = await getDataMode();
  if (mode === 'api') return api.fetchAttempts();
  return local.getAttempts();
}

export async function persistAttempt(attempt: QuizAttempt): Promise<void> {
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
  const mode = await getDataMode();
  if (mode === 'api') {
    await api.downloadExport();
    return;
  }
  const payload: ExportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    quizzes: local.getQuizzes(),
    attempts: local.getAttempts(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mcq-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importAll(payload: ExportPayload): Promise<void> {
  const mode = await getDataMode();
  if (mode === 'api') {
    await api.importData(payload);
    return;
  }
  local.saveQuizzes(payload.quizzes);
  local.saveAttempts(payload.attempts);
}
