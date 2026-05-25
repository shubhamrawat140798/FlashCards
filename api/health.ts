import type { VercelRequest, VercelResponse } from '@vercel/node';
import { nodeRuntime } from './lib/runtime';

export const config = nodeRuntime;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { getConnectionSource, isPostgresConfigured, pingDatabase } =
      await import('./lib/postgres');

    const connectionSource = getConnectionSource();
    const postgresConfigured = isPostgresConfigured();
    const database = postgresConfigured ? await pingDatabase() : false;

    return res.status(200).json({
      ok: true,
      database,
      postgresConfigured,
      connectionSource,
      provider: 'neon',
    });
  } catch (err) {
    console.error('health handler error:', err);
    const message = err instanceof Error ? err.message : 'Health check failed';
    return res.status(200).json({
      ok: false,
      database: false,
      postgresConfigured: Boolean(
        process.env.DATABASE_URL || process.env.POSTGRES_URL
      ),
      error: message,
      provider: 'neon',
    });
  }
}
