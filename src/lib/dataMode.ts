export type DataMode = 'api' | 'local';

let cachedMode: DataMode | null = null;

export function resetDataModeCache() {
  cachedMode = null;
}

export async function getDataMode(): Promise<DataMode> {
  if (import.meta.env.VITE_USE_API === 'true') return 'api';
  if (import.meta.env.VITE_USE_API === 'false') return 'local';
  if (cachedMode) return cachedMode;

  try {
    const base = import.meta.env.VITE_API_URL ?? '';
    const res = await fetch(`${base}/api/health`);
    if (!res.ok) throw new Error('health check failed');
    const data = (await res.json()) as { database?: boolean };
    cachedMode = data.database ? 'api' : 'local';
  } catch {
    cachedMode = 'local';
  }

  return cachedMode;
}

export function isApiMode(): boolean {
  return cachedMode === 'api';
}
