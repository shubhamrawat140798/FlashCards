import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingState } from '../components/LoadingState';

export function AdminLoginPage() {
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/admin';

  if (loading) {
    return <LoadingState message="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setSubmitting(true);
    try {
      const ok = await login(password);
      if (ok) {
        navigate(from, { replace: true });
      } else {
        setError('Incorrect password.');
        setPassword('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="page-title">Admin login</h1>
        <p className="page-subtitle">
          Enter the admin password to manage quizzes and questions.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            className="btn-primary login-submit"
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="login-hint">
          On Vercel, set <code>ADMIN_PASSWORD</code> in project environment variables.
          Local dev defaults to <code>admin</code> when the database is unavailable.
        </p>
      </div>
    </div>
  );
}
