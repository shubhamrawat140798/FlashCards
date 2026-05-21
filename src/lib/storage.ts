import { seedQuizzes } from '../data/seed';
import type { Quiz, QuizAttempt } from '../types/quiz';

const QUIZZES_KEY = 'mcq_quizzes';
const ATTEMPTS_KEY = 'mcq_attempts';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initializeStorage(): void {
  const existing = localStorage.getItem(QUIZZES_KEY);
  if (!existing) {
    writeJson(QUIZZES_KEY, seedQuizzes);
  }
}

export function getQuizzes(): Quiz[] {
  initializeStorage();
  const data = readJson<Quiz[]>(QUIZZES_KEY, seedQuizzes);
  return Array.isArray(data) ? data : seedQuizzes;
}

export function getQuizById(id: string): Quiz | undefined {
  return getQuizzes().find((q) => q.id === id);
}

export function saveQuizzes(quizzes: Quiz[]): void {
  writeJson(QUIZZES_KEY, quizzes);
}

export function upsertQuiz(quiz: Quiz): void {
  const quizzes = getQuizzes();
  const index = quizzes.findIndex((q) => q.id === quiz.id);
  if (index >= 0) {
    quizzes[index] = quiz;
  } else {
    quizzes.push(quiz);
  }
  saveQuizzes(quizzes);
}

export function deleteQuiz(id: string): void {
  saveQuizzes(getQuizzes().filter((q) => q.id !== id));
}

export function getAttempts(): QuizAttempt[] {
  const data = readJson<QuizAttempt[]>(ATTEMPTS_KEY, []);
  return Array.isArray(data) ? data : [];
}

export function getAttemptById(id: string): QuizAttempt | undefined {
  return getAttempts().find((a) => a.id === id);
}

export function saveAttempt(attempt: QuizAttempt): void {
  const attempts = getAttempts();
  attempts.push(attempt);
  writeJson(ATTEMPTS_KEY, attempts);
}

export function saveAttempts(attempts: QuizAttempt[]): void {
  writeJson(ATTEMPTS_KEY, attempts);
}

export function getAttemptsForQuiz(quizId: string): QuizAttempt[] {
  return getAttempts().filter((a) => a.quizId === quizId);
}

export function getBestScoreForQuiz(quizId: string): number | null {
  const attempts = getAttemptsForQuiz(quizId);
  if (attempts.length === 0) return null;
  return Math.max(...attempts.map((a) => a.score));
}
