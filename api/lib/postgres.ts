import type { NeonQueryFunction } from '@neondatabase/serverless';

/** Neon via Vercel integration — matches Storage → Neon → .env.local tab */
const ENV_KEYS = [
  'DATABASE_URL',
  'POSTGRES_URL',
  'DATABASE_URL_UNPOOLED',
  'POSTGRES_URL_NON_POOLING',
  'POSTGRES_PRISMA_URL',
] as const;

let sqlClient: NeonQueryFunction<false, false> | null = null;
let activeEnvKey: (typeof ENV_KEYS)[number] | null = null;
let neonModule: typeof import('@neondatabase/serverless') | null = null;

async function loadNeon() {
  if (!neonModule) {
    neonModule = await import('@neondatabase/serverless');
    // Required for Neon in Node.js serverless (Vercel)
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ws = require('ws');
      neonModule.neonConfig.webSocketConstructor = ws.default ?? ws;
    } catch {
      console.warn('ws package not available; Neon may fail on this runtime');
    }
  }
  return neonModule;
}

export function getConnectionSource(): (typeof ENV_KEYS)[number] | null {
  for (const key of ENV_KEYS) {
    const value = process.env[key];
    if (value && value.trim()) return key;
  }
  return null;
}

export function getConnectionString(): string | undefined {
  const key = getConnectionSource();
  if (!key) return undefined;
  return process.env[key]?.trim();
}

export function isPostgresConfigured(): boolean {
  return Boolean(getConnectionString());
}

export async function getSql(): Promise<NeonQueryFunction<false, false>> {
  const url = getConnectionString();
  const source = getConnectionSource();
  if (!url || !source) {
    throw new Error(
      'Postgres is not configured. Link Neon storage on Vercel — it sets DATABASE_URL automatically.'
    );
  }
  if (!sqlClient || activeEnvKey !== source) {
    const { neon } = await loadNeon();
    sqlClient = neon(url);
    activeEnvKey = source;
  }
  return sqlClient;
}

export function resetSqlClient(): void {
  sqlClient = null;
  activeEnvKey = null;
}

export async function pingDatabase(): Promise<boolean> {
  if (!isPostgresConfigured()) return false;
  try {
    const sql = await getSql();
    await sql`SELECT 1`;
    return true;
  } catch (err) {
    console.error('Postgres ping failed:', err);
    resetSqlClient();
    return false;
  }
}
