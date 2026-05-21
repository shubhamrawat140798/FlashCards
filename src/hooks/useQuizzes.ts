import { useCallback, useEffect, useState } from 'react';
import { resetDataModeCache } from '../lib/dataMode';
import { loadQuizzes, persistQuiz, removeQuiz } from '../lib/dataStore';
import type { Quiz } from '../types/quiz';

const QUIZZES_EVENT = 'mcq-quizzes-changed';

function notify() {
  window.dispatchEvent(new Event(QUIZZES_EVENT));
}

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadQuizzes();
      setQuizzes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(QUIZZES_EVENT, handler);
    return () => window.removeEventListener(QUIZZES_EVENT, handler);
  }, [refresh]);

  const save = useCallback(
    async (quiz: Quiz) => {
      await persistQuiz(quiz);
      notify();
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await removeQuiz(id);
      notify();
      await refresh();
    },
    [refresh]
  );

  const invalidateCache = useCallback(() => {
    resetDataModeCache();
    notify();
  }, []);

  return { quizzes, loading, error, refresh, save, remove, invalidateCache };
}
