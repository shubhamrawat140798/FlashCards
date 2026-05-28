export type Question = {
  id: string;
  text: string;
  options: string[];
  /**
   * Multi-answer support. `correctIndex` remains optional only so older saved
   * quizzes can still be loaded and normalized.
   */
  correctIndexes: number[];
  correctIndex?: number;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  timeLimitMinutes: number;
  questions: Question[];
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  answers: Record<string, number[]>;
  score: number;
  total: number;
  startedAt: string;
  completedAt: string;
  timeSpentSeconds: number;
};

export type ReviewItem = {
  question: Question;
  selected: number[] | undefined;
  correct: boolean;
};

export type GradeResult = {
  score: number;
  total: number;
  review: ReviewItem[];
};
