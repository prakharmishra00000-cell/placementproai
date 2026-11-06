import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  let profile: any = null;
  if (session.role === 'STUDENT') {
    profile = await db.studentProfile.findUnique({
      where: { userId: session.id },
      include: { branch: true, college: true },
    });
  }
  return NextResponse.json({ user: session, profile });
}
