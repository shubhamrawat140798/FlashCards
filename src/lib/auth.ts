const AUTH_KEY = 'mcq_admin_session';

export function getAdminPassword(): string {
  const fromEnv = import.meta.env.VITE_ADMIN_PASSWORD;
  return typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : 'admin';
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

export function login(password: string): boolean {
  if (password !== getAdminPassword()) {
    return false;
  }
  sessionStorage.setItem(AUTH_KEY, '1');
  notifyAuthChange();
  return true;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
  notifyAuthChange();
}

export function notifyAuthChange(): void {
  window.dispatchEvent(new Event('mcq-auth-change'));
}
