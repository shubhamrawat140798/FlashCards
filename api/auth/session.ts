import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthorized } from '../lib/auth';
import { json, methodNotAllowed, serverError } from '../lib/http';
import { nodeRuntime } from '../lib/runtime';

export const config = nodeRuntime;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res);

  try {
    return json(res, 200, { authenticated: isAuthorized(req) });
  } catch (err) {
    return serverError(res, err);
  }
}
