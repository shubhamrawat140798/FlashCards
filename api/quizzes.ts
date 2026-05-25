import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthorized } from './lib/auth';
import { nodeRuntime } from './lib/runtime';

export const config = nodeRuntime;
import { deleteQuiz, fetchAllQuizzes, upsertQuiz, type Quiz } from './lib/db';
import { isPostgresConfigured } from './lib/postgres';
import {
  badRequest,
  json,
  methodNotAllowed,
  readJsonBody,
  serverError,
  unauthorized,
} from './lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!isPostgresConfigured()) {
      return json(res, 503, {
        error: 'Database not configured. Link Neon storage on Vercel (DATABASE_URL) and redeploy.',
      });
    }

    if (req.method === 'GET') {
      const quizzes = await fetchAllQuizzes();
      return json(res, 200, { quizzes });
    }

    if (req.method === 'PUT') {
      if (!isAuthorized(req)) return unauthorized(res);
      const quiz = readJsonBody<Quiz>(req);
      if (!quiz?.id) return badRequest(res, 'Quiz id is required');
      await upsertQuiz(quiz);
      return json(res, 200, { quiz });
    }

    if (req.method === 'DELETE') {
      if (!isAuthorized(req)) return unauthorized(res);
      const id = req.query.id as string | undefined;
      if (!id) return badRequest(res, 'Query param id is required');
      await deleteQuiz(id);
      return json(res, 200, { ok: true });
    }

    return methodNotAllowed(res);
  } catch (err) {
    return serverError(res, err);
  }
}
