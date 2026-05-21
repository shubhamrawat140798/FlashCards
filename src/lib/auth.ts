import * as api from './apiClient';
import { getDataMode } from './dataMode';

const AUTH_KEY = 'mcq_admin_session';

function localLogin(password: string): boolean {
  const fromEnv = import.meta.env.VITE_ADMIN_PASSWORD;
  const expected =
    typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : 'admin';
  if (password !== expected) return false;
  sessionStorage.setItem(AUTH_KEY, '1');
  notifyAuthChange();
  return true;
}

function localIsAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

function localLogout(): void {
  sessionStorage.removeItem(AUTH_KEY);
  notifyAuthChange();
}

export function notifyAuthChange(): void {
  window.dispatchEvent(new Event('mcq-auth-change'));
}

export async function checkAuthenticated(): Promise<boolean> {
  const mode = await getDataMode();
  if (mode === 'api') {
    try {
      return await api.checkSessionApi();
    } catch {
      return false;
    }
  }
  return localIsAuthenticated();
}

export async function login(password: string): Promise<boolean> {
  const mode = await getDataMode();
  if (mode === 'api') {
    try {
      await api.loginApi(password);
      notifyAuthChange();
      return true;
    } catch {
      return false;
    }
  }
  return localLogin(password);
}

export async function logout(): Promise<void> {
  const mode = await getDataMode();
  if (mode === 'api') {
    try {
      await api.logoutApi();
    } catch {
      /* ignore */
    }
  } else {
    localLogout();
  }
  notifyAuthChange();
}

/** Sync check for local mode only; prefer useAuth hook */
export function isAuthenticatedSync(): boolean {
  return localIsAuthenticated();
}
