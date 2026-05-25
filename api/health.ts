import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isDatabaseAvailable } from './lib/db';
import { json, serverError } from './lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const database = await isDatabaseAvailable();
    return json(res, 200, {
      ok: true,
      database,
      postgresConfigured: Boolean(process.env.POSTGRES_URL),
    });
  } catch (err) {
    return serverError(res, err);
  }
}
