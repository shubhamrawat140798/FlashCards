import type { ExportPayload } from '../types/export';
import type { Quiz, QuizAttempt } from '../types/quiz';

const base = import.meta.env.VITE_API_URL ?? '';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = (await res.json()) as { error?: string };
      if (err.error) message = err.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function checkHealth(): Promise<{
  ok: boolean;
  database: boolean;
  postgresConfigured?: boolean;
  connectionSource?: string | null;
  provider?: string;
  error?: string;
}> {
  return request('/api/health');
}

export async function fetchQuizzes(): Promise<Quiz[]> {
  const data = await request<{ quizzes: Quiz[] }>('/api/quizzes');
  return data.quizzes;
}

export async function saveQuiz(quiz: Quiz): Promise<Quiz> {
  const data = await request<{ quiz: Quiz }>('/api/quizzes', {
    method: 'PUT',
    body: JSON.stringify(quiz),
  });
  return data.quiz;
}

export async function deleteQuizApi(id: string): Promise<void> {
  await request(`/api/quizzes?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function fetchAttempts(): Promise<QuizAttempt[]> {
  const data = await request<{ attempts: QuizAttempt[] }>('/api/attempts');
  return data.attempts;
}

export async function saveAttemptApi(attempt: QuizAttempt): Promise<QuizAttempt> {
  const data = await request<{ attempt: QuizAttempt }>('/api/attempts', {
    method: 'POST',
    body: JSON.stringify(attempt),
  });
  return data.attempt;
}

export async function loginApi(password: string): Promise<void> {
  await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export async function logoutApi(): Promise<void> {
  await request('/api/auth/logout', { method: 'POST' });
}

export async function checkSessionApi(): Promise<boolean> {
  const data = await request<{ authenticated: boolean }>('/api/auth/session');
  return data.authenticated;
}

export async function downloadExport(): Promise<void> {
  const res = await fetch(`${base}/api/export`, { credentials: 'include' });
  if (!res.ok) throw new Error('Export failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mcq-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importData(payload: ExportPayload): Promise<void> {
  await request('/api/import', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
