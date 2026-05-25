import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  createSessionToken,
  getAdminPassword,
  setAuthCookie,
} from '../lib/auth';
import { badRequest, json, methodNotAllowed, readJsonBody, serverError } from '../lib/http';
import { nodeRuntime } from '../lib/runtime';

export const config = nodeRuntime;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res);

  try {
    const { password } = readJsonBody<{ password?: string }>(req);
    if (!password) return badRequest(res, 'Password is required');

    if (password !== getAdminPassword()) {
      return json(res, 401, { error: 'Incorrect password' });
    }

    const token = createSessionToken();
    setAuthCookie(res, token);
    return json(res, 200, { ok: true });
  } catch (err) {
    return serverError(res, err);
  }
}
