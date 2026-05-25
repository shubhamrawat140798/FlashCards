import * as api from './apiClient';

export type DataMode = 'api' | 'local';

export type HealthStatus = {
  mode: DataMode;
  database: boolean;
  apiReachable: boolean;
  error?: string;
};

let cachedStatus: HealthStatus | null = null;

/** Production and VITE_USE_API=true always use the database API — never localStorage. */
export function useDatabaseOnly(): boolean {
  return (
    import.meta.env.PROD ||
    import.meta.env.VITE_USE_API === 'true'
  );
}

export function resetDataModeCache(): void {
  cachedStatus = null;
}

export async function getHealthStatus(force = false): Promise<HealthStatus> {
  if (import.meta.env.VITE_USE_API === 'false') {
    const status: HealthStatus = {
      mode: 'local',
      database: false,
      apiReachable: false,
    };
    cachedStatus = status;
    return status;
  }

  if (!force && cachedStatus) return cachedStatus;

  try {
    const health = await api.checkHealth();
    const postgresConfigured = Boolean(health.postgresConfigured);

    let error: string | undefined;
    if (!health.database) {
      if (postgresConfigured) {
        error =
          'DATABASE_URL is set but the database is not reachable. Check Neon and redeploy.';
      } else {
        error =
          'DATABASE_URL is not configured. Link Neon storage on Vercel and redeploy.';
      }
    }

    const status: HealthStatus = {
      mode: health.database ? 'api' : useDatabaseOnly() ? 'api' : 'local',
      database: health.database,
      apiReachable: health.ok ?? false,
      error,
    };
    cachedStatus = status;
    return status;
  } catch (e) {
    const status: HealthStatus = {
      mode: useDatabaseOnly() ? 'api' : 'local',
      database: false,
      apiReachable: false,
      error:
        e instanceof Error
          ? e.message
          : 'Cannot reach API. Deploy with Neon linked or run npm run dev:full.',
    };
    cachedStatus = status;
    return status;
  }
}

export async function getDataMode(force = false): Promise<DataMode> {
  if (useDatabaseOnly()) return 'api';
  const status = await getHealthStatus(force);
  return status.database ? 'api' : status.mode;
}

export async function requireDatabase(): Promise<HealthStatus> {
  const status = await getHealthStatus(true);
  if (!status.database) {
    throw new Error(
      status.error ??
        'Database is required. Connect Neon on Vercel, set DATABASE_URL, and redeploy.'
    );
  }
  return status;
}

export function isApiMode(): boolean {
  if (useDatabaseOnly()) return true;
  return cachedStatus?.mode === 'api' && cachedStatus.database === true;
}
