import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getConnectionSource,
  isPostgresConfigured,
  pingDatabase,
} from './lib/postgres';
import { json, serverError } from './lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const connectionSource = getConnectionSource();
    const postgresConfigured = isPostgresConfigured();
    const database = postgresConfigured ? await pingDatabase() : false;

    return json(res, 200, {
      ok: true,
      database,
      postgresConfigured,
      connectionSource,
      provider: 'neon',
    });
  } catch (err) {
    return serverError(res, err);
  }
}
