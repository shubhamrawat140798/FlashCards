import { useCallback, useEffect, useState } from 'react';
import { loadAttempts, persistAttempt } from '../lib/dataStore';
import type { QuizAttempt } from '../types/quiz';

const ATTEMPTS_EVENT = 'mcq-attempts-changed';

function notify() {
  window.dispatchEvent(new Event(ATTEMPTS_EVENT));
}

export function useAttempts() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadAttempts();
      setAttempts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load attempts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(ATTEMPTS_EVENT, handler);
    return () => window.removeEventListener(ATTEMPTS_EVENT, handler);
  }, [refresh]);

  const addAttempt = useCallback(
    async (attempt: QuizAttempt) => {
      await persistAttempt(attempt);
      notify();
      await refresh();
    },
    [refresh]
  );

  return { attempts, loading, error, refresh, addAttempt };
}
