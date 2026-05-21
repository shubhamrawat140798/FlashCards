import crypto from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const COOKIE_NAME = 'mcq_admin';
const MAX_AGE_SEC = 60 * 60 * 24;

function getSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'change-me-in-production'
  );
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'admin';
}

export function createSessionToken(): string {
  const payload = `admin:${Date.now()}`;
  const sig = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const lastColon = decoded.lastIndexOf(':');
    if (lastColon === -1) return false;
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    const expected = crypto
      .createHmac('sha256', getSecret())
      .update(payload)
      .digest('hex');
    if (sig !== expected || !payload.startsWith('admin:')) return false;
    const ts = parseInt(payload.split(':')[1] ?? '0', 10);
    return Date.now() - ts < MAX_AGE_SEC * 1000;
  } catch {
    return false;
  }
}

function parseCookies(req: VercelRequest): Record<string, string> {
  const header = req.headers.cookie ?? '';
  return header.split(';').reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (key) acc[key] = rest.join('=');
    return acc;
  }, {});
}

export function isAuthorized(req: VercelRequest): boolean {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  return token ? verifySessionToken(token) : false;
}

export function setAuthCookie(res: VercelResponse, token: string) {
  const secure = process.env.NODE_ENV === 'production';
  const parts = [
    `${COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE_SEC}`,
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearAuthCookie(res: VercelResponse) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}
