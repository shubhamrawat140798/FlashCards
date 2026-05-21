import type { VercelRequest, VercelResponse } from '@vercel/node';

export function json(res: VercelResponse, status: number, body: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.json(body);
}

export function methodNotAllowed(res: VercelResponse) {
  json(res, 405, { error: 'Method not allowed' });
}

export function unauthorized(res: VercelResponse) {
  json(res, 401, { error: 'Unauthorized' });
}

export function badRequest(res: VercelResponse, message: string) {
  json(res, 400, { error: message });
}

export function serverError(res: VercelResponse, err: unknown) {
  console.error(err);
  const message = err instanceof Error ? err.message : 'Internal server error';
  json(res, 500, { error: message });
}

export function readJsonBody<T>(req: VercelRequest): T {
  if (typeof req.body === 'string') {
    return JSON.parse(req.body) as T;
  }
  return req.body as T;
}
