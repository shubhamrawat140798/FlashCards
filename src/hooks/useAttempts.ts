import { useCallback, useEffect, useState } from 'react';
import { getAttempts, saveAttempt } from '../lib/storage';
import type { QuizAttempt } from '../types/quiz';

const ATTEMPTS_EVENT = 'mcq-attempts-changed';

function notify() {
  window.dispatchEvent(new Event(ATTEMPTS_EVENT));
}

export function useAttempts() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getAttempts());

  useEffect(() => {
    const refresh = () => setAttempts(getAttempts());
    window.addEventListener(ATTEMPTS_EVENT, refresh);
    return () => window.removeEventListener(ATTEMPTS_EVENT, refresh);
  }, []);

  const addAttempt = useCallback((attempt: QuizAttempt) => {
    saveAttempt(attempt);
    notify();
  }, []);

  return { attempts, addAttempt };
}
