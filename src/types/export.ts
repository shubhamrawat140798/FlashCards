import type { Quiz, QuizAttempt } from './quiz';

export type ExportPayload = {
  version: 1;
  exportedAt: string;
  quizzes: Quiz[];
  attempts: QuizAttempt[];
};
