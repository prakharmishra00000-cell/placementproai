import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { alumniId, message } = await req.json();
  if (!alumniId || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const req2 = await db.mentorshipRequest.create({
    data: { studentUserId: session.id, alumniId, message },
  });
  // Notify alumni
  const alumni = await db.alumniProfile.findUnique({ where: { id: alumniId } });
  if (alumni) {
    await db.notification.create({
      data: { userId: alumni.userId, title: 'New mentorship request', message: `From ${session.name}: ${message.slice(0, 80)}`, type: 'INFO' },
    });
  }
  return NextResponse.json({ request: req2 });
}
