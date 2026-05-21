import { useCallback, useEffect, useState } from 'react';
import { checkAuthenticated, login as authLogin, logout as authLogout } from '../lib/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setIsAuthenticated(await checkAuthenticated());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => {
      refresh();
    };
    window.addEventListener('mcq-auth-change', onChange);
    return () => window.removeEventListener('mcq-auth-change', onChange);
  }, [refresh]);

  const login = useCallback(async (password: string) => {
    const ok = await authLogin(password);
    if (ok) setIsAuthenticated(true);
    return ok;
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, loading, login, logout, refresh };
}
