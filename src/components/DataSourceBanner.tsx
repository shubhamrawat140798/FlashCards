import type { HealthStatus } from '../lib/dataMode';
import { useDatabaseOnly } from '../lib/dataMode';

type DataSourceBannerProps = {
  status: HealthStatus | null;
  loading?: boolean;
  onRecheck?: () => void;
  variant?: 'compact' | 'full';
};

export function DataSourceBanner({
  status,
  loading,
  onRecheck,
  variant = 'full',
}: DataSourceBannerProps) {
  if (loading || !status) {
    return (
      <div className="data-source-banner data-source-loading" role="status">
        Checking database connection…
      </div>
    );
  }

  const isDatabase = status.database;
  const databaseOnly = useDatabaseOnly();

  return (
    <div
      className={`data-source-banner ${isDatabase ? 'data-source-db' : 'data-source-local'}`}
      role="status"
    >
      <div className="data-source-main">
        <span className="data-source-label">
          Data source:{' '}
          <strong>
            {isDatabase
              ? 'Database (Neon Postgres)'
              : databaseOnly
                ? 'Database unavailable'
                : 'Browser only (localStorage)'}
          </strong>
        </span>
        {variant === 'full' && status.error && (
          <p className="data-source-detail">{status.error}</p>
        )}
        {variant === 'full' && !isDatabase && databaseOnly && (
          <p className="data-source-detail">
            Admin save/delete requires the database. This app does not use
            localStorage in production. Fix the connection, click Recheck, then
            try again.
          </p>
        )}
        {variant === 'full' && !isDatabase && !databaseOnly && (
          <p className="data-source-detail">
            Running in local dev mode without API. Set{' '}
            <code>VITE_USE_API=true</code> and run <code>npm run dev:full</code>{' '}
            to use the database locally.
          </p>
        )}
        {variant === 'full' && isDatabase && (
          <p className="data-source-detail">
            All quizzes and attempts are stored in Neon. Add, edit, and delete
            in Admin Portal write directly to the database.
          </p>
        )}
      </div>
      {onRecheck && (
        <button type="button" className="btn-ghost btn-sm" onClick={onRecheck}>
          Recheck
        </button>
      )}
    </div>
  );
}
