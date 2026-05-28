import type { GradeResult, Quiz } from '../types/quiz';

function normalizeIndexes(indexes: number[] | undefined): number[] {
  if (!indexes) return [];
  return Array.from(new Set(indexes)).sort((a, b) => a - b);
}

function setsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function gradeQuiz(
  quiz: Quiz,
  answers: Record<string, number[]>
): GradeResult {
  let score = 0;
  const review = quiz.questions.map((q) => {
    const selected = normalizeIndexes(answers[q.id]);
    const correctAnswers = normalizeIndexes(q.correctIndexes);
    const correct = setsEqual(selected, correctAnswers);
    if (correct) score++;
    return { question: q, selected, correct };
  });
  return { score, total: quiz.questions.length, review };
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatPercent(score: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((score / total) * 100)}%`;
}
