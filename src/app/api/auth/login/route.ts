// /api/auth/login
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hash, setSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    const user = await db.user.findUnique({ where: { email } });
    if (!user || user.passwordHash !== hash(password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    if (user.status !== 'ACTIVE') return NextResponse.json({ error: 'Account suspended' }, { status: 403 });
    await setSession(user.id);
    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role, collegeId: user.collegeId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
