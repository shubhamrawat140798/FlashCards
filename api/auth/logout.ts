import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearAuthCookie } from '../lib/auth';
import { json, methodNotAllowed, serverError } from '../lib/http';
import { nodeRuntime } from '../lib/runtime';

export const config = nodeRuntime;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res);

  try {
    clearAuthCookie(res);
    return json(res, 200, { ok: true });
  } catch (err) {
    return serverError(res, err);
  }
}
