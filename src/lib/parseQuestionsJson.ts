import { validateQuestion } from './validation';
import type { Question } from '../types/quiz';

type RawQuestion = {
  id?: string;
  text?: string;
  options?: string[];
  correctIndex?: number;
  correctIndexes?: number[];
  // Common alias in imported datasets
  correctAnswers?: number[];
};

function normalizeQuestion(raw: RawQuestion, index: number): Question {
  const options = Array.isArray(raw.options)
    ? raw.options.map((o) => String(o).trim()).filter(Boolean)
    : [];

  if (options.length < 2) {
    throw new Error(
      `Question ${index + 1}: "options" must be an array with at least 2 non-empty strings.`
    );
  }

  const max = options.length - 1;
  let correctIndexes: number[] = [];
  const rawList =
    Array.isArray(raw.correctIndexes)
      ? raw.correctIndexes
      : Array.isArray(raw.correctAnswers)
        ? raw.correctAnswers
        : null;

  if (rawList) {
    // Accept either 0-based or 1-based lists. Heuristic:
    // - if any index equals options.length, it's definitely 1-based.
    // - else keep as-is (0-based).
    const looksOneBased = rawList.some((n) => typeof n === 'number' && Math.trunc(n) === options.length);
    correctIndexes = rawList
      .filter((n) => typeof n === 'number' && Number.isFinite(n))
      .map((n) => (looksOneBased ? Math.trunc(n) - 1 : Math.trunc(n)))
      .filter((n) => n >= 0 && n <= max);
  } else if (typeof raw.correctIndex === 'number') {
    const n = Math.trunc(raw.correctIndex);
    if (n >= 0 && n <= max) correctIndexes = [n];
  }

  correctIndexes = Array.from(new Set(correctIndexes)).sort((a, b) => a - b);

  if (correctIndexes.length === 0) {
    throw new Error(
      `Question ${index + 1}: provide "correctIndex" (number) or "correctIndexes"/"correctAnswers" (number[]).`
    );
  }

  const text = typeof raw.text === 'string' ? raw.text.trim() : '';
  if (!text) {
    throw new Error(`Question ${index + 1}: "text" is required.`);
  }

  const question: Question = {
    id: typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : crypto.randomUUID(),
    text,
    options,
    correctIndexes,
  };

  const validationErrors = validateQuestion(question);
  if (validationErrors.length > 0) {
    throw new Error(`Question ${index + 1}: ${validationErrors.join(' ')}`);
  }

  return question;
}

function extractRawList(parsed: unknown): RawQuestion[] {
  if (Array.isArray(parsed)) {
    return parsed as RawQuestion[];
  }

  if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.questions)) {
      return obj.questions as RawQuestion[];
    }
    if ('text' in obj || 'options' in obj) {
      return [obj as RawQuestion];
    }
  }

  throw new Error(
    'JSON must be a question object, an array of questions, or { "questions": [...] }.'
  );
}

export function parseQuestionsJson(jsonText: string): Question[] {
  const trimmed = jsonText.trim();
  if (!trimmed) {
    throw new Error('Paste JSON to import questions.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error('Invalid JSON syntax.');
  }

  const rawList = extractRawList(parsed);
  if (rawList.length === 0) {
    throw new Error('No questions found in JSON.');
  }

  return rawList.map((raw, i) => normalizeQuestion(raw, i));
}

export const QUESTION_JSON_EXAMPLE = `[
  {
    "text": "Which keyword declares a block-scoped variable?",
    "options": ["var", "let", "function", "const"],
    "correctIndexes": [1]
  },
  {
    "text": "What is 2 + 2?",
    "options": ["3", "4", "5"],
    "correctIndexes": [1]
  }
]`;
