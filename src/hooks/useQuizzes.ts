import { useCallback, useEffect, useState } from 'react';
import {
  deleteQuiz,
  getQuizzes,
  saveQuizzes,
  upsertQuiz,
} from '../lib/storage';
import type { Quiz } from '../types/quiz';

const QUIZZES_EVENT = 'mcq-quizzes-changed';

function notify() {
  window.dispatchEvent(new Event(QUIZZES_EVENT));
}

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => getQuizzes());

  useEffect(() => {
    const refresh = () => setQuizzes(getQuizzes());
    window.addEventListener(QUIZZES_EVENT, refresh);
    return () => window.removeEventListener(QUIZZES_EVENT, refresh);
  }, []);

  const refresh = useCallback(() => {
    setQuizzes(getQuizzes());
  }, []);

  const save = useCallback((quiz: Quiz) => {
    upsertQuiz(quiz);
    notify();
  }, []);

  const remove = useCallback((id: string) => {
    deleteQuiz(id);
    notify();
  }, []);

  const replaceAll = useCallback((next: Quiz[]) => {
    saveQuizzes(next);
    notify();
  }, []);

  return { quizzes, refresh, save, remove, replaceAll };
}
