import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthorized } from './lib/auth';
import { exportAll } from './lib/db';
import { methodNotAllowed, serverError, unauthorized } from './lib/http';
import { nodeRuntime } from './lib/runtime';

export const config = nodeRuntime;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res);
  if (!isAuthorized(req)) return unauthorized(res);

  try {
    const data = await exportAll();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="mcq-export-${new Date().toISOString().slice(0, 10)}.json"`
    );
    return res.status(200).send(JSON.stringify(data, null, 2));
  } catch (err) {
    return serverError(res, err);
  }
}
