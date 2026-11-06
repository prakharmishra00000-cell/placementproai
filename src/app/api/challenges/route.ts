import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date'); // YYYY-MM-DD
  const today = date || new Date().toISOString().slice(0, 10);
  const session = await getSession();
  let attempted: any[] = [];
  if (session) {
    const challengesToday = await db.dailyChallenge.findMany({ where: { date: today } });
    const ids = challengesToday.map(c => c.id);
    attempted = await db.challengeAttempt.findMany({
      where: { userId: session.id, challengeId: { in: ids } },
    });
  }
  let challenge = await db.dailyChallenge.findUnique({ where: { date: today } });
  if (!challenge) {
    // Auto-create today's challenge if missing
    challenge = await db.dailyChallenge.create({
      data: {
        date: today,
        category: 'APTITUDE',
        title: 'Daily Quant Challenge',
        description: 'Solve this percentage problem.',
        question: 'A shop offers 25% discount on a marked price of Rs 800. What is the selling price?',
        answer: '600',
        points: 10,
      },
    });
  }
  return NextResponse.json({
    challenge,
    attempted: attempted.map(a => ({ challengeId: a.challengeId, isCorrect: a.isCorrect })),
  });
}
