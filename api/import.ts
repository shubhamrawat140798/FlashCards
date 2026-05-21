import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthorized } from './lib/auth';
import { importAll, type ExportPayload } from './lib/db';
import {
  badRequest,
  json,
  methodNotAllowed,
  readJsonBody,
  serverError,
  unauthorized,
} from './lib/http';

function isValidPayload(body: unknown): body is ExportPayload {
  if (!body || typeof body !== 'object') return false;
  const p = body as ExportPayload;
  return Array.isArray(p.quizzes) && Array.isArray(p.attempts);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res);
  if (!isAuthorized(req)) return unauthorized(res);

  try {
    const body = readJsonBody<unknown>(req);
    if (!isValidPayload(body)) {
      return badRequest(res, 'Invalid import file. Expected quizzes and attempts arrays.');
    }
    await importAll(body);
    return json(res, 200, {
      ok: true,
      quizzes: body.quizzes.length,
      attempts: body.attempts.length,
    });
  } catch (err) {
    return serverError(res, err);
  }
}
