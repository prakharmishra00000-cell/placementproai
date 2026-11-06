// src/lib/auth.ts - Server-side auth helpers
import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { db } from './db';

export const SALT = '__ppa_salt__';
export const hash = (pw: string) => createHash('sha256').update(pw + SALT).digest('hex');
export const SESSION_COOKIE = 'ppa_session';

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  collegeId: string | null;
};

// Simple session: encode userId.signature in cookie. We hash userId with secret.
const SESSION_SECRET = 'placement_pro_ai_v1_secret';

function sign(userId: string) {
  return createHash('sha256').update(userId + SESSION_SECRET).digest('hex').slice(0, 32);
}

export async function setSession(userId: string) {
  const sig = sign(userId);
  const value = Buffer.from(`${userId}.${sig}`).toString('base64');
  (await cookies()).set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const c = (await cookies()).get(SESSION_COOKIE);
  if (!c) return null;
  try {
    const decoded = Buffer.from(c.value, 'base64').toString();
    const [userId, sig] = decoded.split('.');
    if (!userId || !sig) return null;
    if (sign(userId) !== sig) return null;
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== 'ACTIVE') return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role, collegeId: user.collegeId };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionUser> {
  const s = await getSession();
  if (!s) throw new Error('UNAUTHORIZED');
  return s;
}

export async function requireRole(roles: string[]): Promise<SessionUser> {
  const s = await requireSession();
  if (!roles.includes(s.role)) throw new Error('FORBIDDEN');
  return s;
}
