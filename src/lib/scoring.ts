import type { GradeResult, Quiz } from '../types/quiz';

export function gradeQuiz(
  quiz: Quiz,
  answers: Record<string, number>
): GradeResult {
  let score = 0;
  const review = quiz.questions.map((q) => {
    const selected = answers[q.id];
    const correct = selected === q.correctIndex;
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
