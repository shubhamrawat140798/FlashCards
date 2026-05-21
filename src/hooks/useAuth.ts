import { useCallback, useEffect, useState } from 'react';
import { isAuthenticated, login as authLogin, logout as authLogout } from '../lib/auth';

export function useAuth() {
  const [authed, setAuthed] = useState(isAuthenticated);

  useEffect(() => {
    const refresh = () => setAuthed(isAuthenticated());
    window.addEventListener('mcq-auth-change', refresh);
    return () => window.removeEventListener('mcq-auth-change', refresh);
  }, []);

  const login = useCallback((password: string) => authLogin(password), []);

  const logout = useCallback(() => {
    authLogout();
  }, []);

  return { isAuthenticated: authed, login, logout };
}
