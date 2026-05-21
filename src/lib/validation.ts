import type { Question, Quiz } from '../types/quiz';

export function validateQuiz(quiz: Quiz): string[] {
  const errors: string[] = [];

  if (!quiz.title.trim()) errors.push('Title is required.');
  if (!quiz.category.trim()) errors.push('Category is required.');
  if (quiz.timeLimitMinutes < 1) errors.push('Time limit must be at least 1 minute.');
  if (quiz.questions.length === 0) errors.push('Add at least one question.');

  quiz.questions.forEach((q, i) => {
    const qErrors = validateQuestion(q);
    qErrors.forEach((e) => errors.push(`Question ${i + 1}: ${e}`));
  });

  return errors;
}

export function validateQuestion(q: Question): string[] {
  const errors: string[] = [];

  if (!q.text.trim()) errors.push('Question text is required.');

  const filled = q.options.filter((o) => o.trim());
  if (filled.length < 2) errors.push('At least 2 options are required.');

  if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
    errors.push('Select a valid correct answer.');
  } else if (!q.options[q.correctIndex]?.trim()) {
    errors.push('Correct option cannot be empty.');
  }

  return errors;
}
