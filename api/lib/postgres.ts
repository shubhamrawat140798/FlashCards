import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let sqlClient: NeonQueryFunction<false, false> | null = null;

export function getConnectionString(): string | undefined {
  return (
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL
  );
}

export function isPostgresConfigured(): boolean {
  return Boolean(getConnectionString());
}

export function getSql(): NeonQueryFunction<false, false> {
  const url = getConnectionString();
  if (!url) {
    throw new Error(
      'Postgres is not configured. Set POSTGRES_URL (link Vercel Postgres / Neon storage).'
    );
  }
  if (!sqlClient) {
    sqlClient = neon(url);
  }
  return sqlClient;
}

export function resetSqlClient(): void {
  sqlClient = null;
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
