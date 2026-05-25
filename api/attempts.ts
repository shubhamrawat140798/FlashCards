import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchAllAttempts, insertAttempt, type QuizAttempt } from './lib/db';
import { isPostgresConfigured } from './lib/postgres';
import {
  badRequest,
  json,
  methodNotAllowed,
  readJsonBody,
  serverError,
} from './lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!isPostgresConfigured()) {
      return json(res, 503, {
        error: 'Database not configured. Link Postgres storage on Vercel and redeploy.',
      });
    }

    if (req.method === 'GET') {
      const attempts = await fetchAllAttempts();
      return json(res, 200, { attempts });
    }

    if (req.method === 'POST') {
      const attempt = readJsonBody<QuizAttempt>(req);
      if (!attempt?.id || !attempt.quizId) {
        return badRequest(res, 'Invalid attempt payload');
      }
      await insertAttempt(attempt);
      return json(res, 201, { attempt });
    }

    return methodNotAllowed(res);
  } catch (err) {
    return serverError(res, err);
  }
}
