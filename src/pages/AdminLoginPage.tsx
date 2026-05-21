import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/admin';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    if (login(password)) {
      navigate(from, { replace: true });
    } else {
      setError('Incorrect password.');
      setPassword('');
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
            />
          </div>

          <button type="submit" className="btn-primary login-submit">
            Sign in
          </button>
        </form>

        <p className="login-hint">
          Default password is <code>admin</code> unless you set{' '}
          <code>VITE_ADMIN_PASSWORD</code> in a <code>.env</code> file.
        </p>
      </div>
    </div>
  );
}
