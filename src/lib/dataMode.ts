import * as api from './apiClient';

export type DataMode = 'api' | 'local';

export type HealthStatus = {
  mode: DataMode;
  database: boolean;
  apiReachable: boolean;
  error?: string;
};

let cachedStatus: HealthStatus | null = null;

export function resetDataModeCache(): void {
  cachedStatus = null;
}

export async function getHealthStatus(force = false): Promise<HealthStatus> {
  if (import.meta.env.VITE_USE_API === 'true') {
    const status: HealthStatus = {
      mode: 'api',
      database: true,
      apiReachable: true,
    };
    if (!force && cachedStatus) return cachedStatus;
    try {
      const health = await api.checkHealth();
      status.database = health.database;
      status.apiReachable = health.ok;
      if (!health.database) {
        const hint = (health as { postgresConfigured?: boolean }).postgresConfigured
          ? 'Postgres URL is set but connection failed.'
          : 'POSTGRES_URL is missing — link Vercel Postgres storage and redeploy.';
        status.error = `API is up but database is not available. ${hint}`;
      }
    } catch (e) {
      status.apiReachable = false;
      status.error =
        e instanceof Error ? e.message : 'Cannot reach /api/health';
    }
    cachedStatus = status;
    return status;
  }

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
    const hint = (health as { postgresConfigured?: boolean }).postgresConfigured
      ? 'Postgres is configured but not reachable.'
      : 'POSTGRES_URL not set on this deployment.';
    const status: HealthStatus = {
      mode: health.database ? 'api' : 'local',
      database: health.database,
      apiReachable: health.ok,
      error: health.database
        ? undefined
        : `Database not connected (${hint}) — saving to this browser only (localStorage).`,
    };
    cachedStatus = status;
    return status;
  } catch (e) {
    const status: HealthStatus = {
      mode: 'local',
      database: false,
      apiReachable: false,
      error:
        e instanceof Error
          ? e.message
          : 'API unreachable — saving to this browser only (localStorage).',
    };
    cachedStatus = status;
    return status;
  }
}

export async function getDataMode(force = false): Promise<DataMode> {
  const status = await getHealthStatus(force);
  return status.mode;
}

export function isApiMode(): boolean {
  return cachedStatus?.mode === 'api';
}
