import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { id } = await params;
  const { answer } = await req.json();
  const challenge = await db.dailyChallenge.findUnique({ where: { id } });
  if (!challenge) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  // Prevent duplicate attempts
  const existing = await db.challengeAttempt.findFirst({ where: { userId: session.id, challengeId: id } });
  if (existing) return NextResponse.json({ error: 'Already attempted today', attempt: existing }, { status: 409 });

  const isCorrect = String(answer).trim().toLowerCase() === String(challenge.answer).trim().toLowerCase();
  const earnedPoints = isCorrect ? challenge.points : 0;
  const attempt = await db.challengeAttempt.create({
    data: { userId: session.id, challengeId: id, submittedAnswer: String(answer), isCorrect, earnedPoints },
  });
  return NextResponse.json({ attempt, correctAnswer: challenge.answer, isCorrect });
}
