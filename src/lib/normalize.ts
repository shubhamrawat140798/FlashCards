import type { Question, Quiz, QuizAttempt } from '../types/quiz';

function uniqueSortedNumbers(values: number[]): number[] {
  return Array.from(new Set(values.filter((v) => Number.isFinite(v)))).sort((a, b) => a - b);
}

export function normalizeQuestion(raw: unknown): Question {
  const q = raw as Partial<Question> & { correctIndexes?: unknown; correctIndex?: unknown };

  const options = Array.isArray(q.options) ? q.options : [];
  const maxIndex = Math.max(0, options.length - 1);

  let correctIndexes: number[] = [];
  if (Array.isArray(q.correctIndexes)) {
    correctIndexes = q.correctIndexes.map((n) => (typeof n === 'number' ? n : Number.NaN));
  } else if (typeof q.correctIndex === 'number') {
    correctIndexes = [q.correctIndex];
  }

  correctIndexes = uniqueSortedNumbers(
    correctIndexes.filter((idx) => idx >= 0 && idx <= maxIndex)
  );

  if (correctIndexes.length === 0 && options.length > 0) {
    correctIndexes = [0];
  }

  return {
    id: String(q.id ?? crypto.randomUUID()),
    text: String(q.text ?? ''),
    options: options.map((o) => String(o)),
    correctIndexes,
  };
}

export function normalizeQuiz(raw: unknown): Quiz {
  const quiz = raw as Partial<Quiz> & { questions?: unknown };
  const questionsRaw = Array.isArray(quiz.questions) ? quiz.questions : [];

  return {
    id: String(quiz.id ?? crypto.randomUUID()),
    title: String(quiz.title ?? ''),
    description: String(quiz.description ?? ''),
    category: String(quiz.category ?? ''),
    timeLimitMinutes: typeof quiz.timeLimitMinutes === 'number' ? quiz.timeLimitMinutes : 10,
    questions: questionsRaw.map(normalizeQuestion),
  };
}

export function normalizeAttempt(raw: unknown): QuizAttempt {
  const attempt = raw as Partial<QuizAttempt> & { answers?: unknown };
  const answersRaw = attempt.answers && typeof attempt.answers === 'object' ? attempt.answers : {};
  const normalizedAnswers: Record<string, number[]> = {};

  for (const [qid, value] of Object.entries(answersRaw as Record<string, unknown>)) {
    if (typeof value === 'number') {
      normalizedAnswers[qid] = [value];
    } else if (Array.isArray(value)) {
      const nums = value.map((n) => (typeof n === 'number' ? n : Number.NaN));
      normalizedAnswers[qid] = uniqueSortedNumbers(nums);
    }
  }

  return {
    id: String(attempt.id ?? crypto.randomUUID()),
    quizId: String(attempt.quizId ?? ''),
    answers: normalizedAnswers,
    score: typeof attempt.score === 'number' ? attempt.score : 0,
    total: typeof attempt.total === 'number' ? attempt.total : 0,
    startedAt: String(attempt.startedAt ?? new Date().toISOString()),
    completedAt: String(attempt.completedAt ?? new Date().toISOString()),
    timeSpentSeconds: typeof attempt.timeSpentSeconds === 'number' ? attempt.timeSpentSeconds : 0,
  };
}

