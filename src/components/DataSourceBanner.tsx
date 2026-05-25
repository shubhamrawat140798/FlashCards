import type { HealthStatus } from '../lib/dataMode';

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
        Checking data connection…
      </div>
    );
  }

  const isDatabase = status.mode === 'api' && status.database;

  return (
    <div
      className={`data-source-banner ${isDatabase ? 'data-source-db' : 'data-source-local'}`}
      role="status"
    >
      <div className="data-source-main">
        <span className="data-source-label">
          Data source:{' '}
          <strong>{isDatabase ? 'Database (Vercel Postgres)' : 'Browser only (localStorage)'}</strong>
        </span>
        {variant === 'full' && status.error && (
          <p className="data-source-detail">{status.error}</p>
        )}
        {variant === 'full' && !isDatabase && (
          <p className="data-source-detail">
            Changes are saved only in this browser until Postgres is connected. Other
            users and the SQL console will not see your edits. Link Postgres in Vercel
            → Storage, set <code>POSTGRES_URL</code>, then redeploy.
          </p>
        )}
        {variant === 'full' && isDatabase && (
          <p className="data-source-detail">
            Quizzes and attempts are stored in the shared database. All visitors see
            the same content after you save.
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
