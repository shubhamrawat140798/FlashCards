import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

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

export function getSql(): NeonQueryFunction<false, false> {
  const url = getConnectionString();
  const source = getConnectionSource();
  if (!url || !source) {
    throw new Error(
      'Postgres is not configured. Link Neon storage on Vercel — it sets DATABASE_URL automatically.'
    );
  }
  if (!sqlClient || activeEnvKey !== source) {
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
    const sql = getSql();
    await sql`SELECT 1`;
    return true;
  } catch (err) {
    console.error('Postgres ping failed:', err);
    resetSqlClient();
    return false;
  }
}
