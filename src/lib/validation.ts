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

  const correct = Array.isArray(q.correctIndexes) ? q.correctIndexes : [];
  if (correct.length === 0) {
    errors.push('Select at least one correct answer.');
  } else {
    const max = q.options.length - 1;
    const invalid = correct.some((idx) => idx < 0 || idx > max);
    if (invalid) errors.push('Select valid correct answer(s).');
    const emptyCorrect = correct.some((idx) => !q.options[idx]?.trim());
    if (emptyCorrect) errors.push('Correct option cannot be empty.');
  }

  return errors;
}
