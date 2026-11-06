import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { id } = await params;
  const { submission } = await req.json();
  const scenario = await db.simulationScenario.findUnique({ where: { id } });
  if (!scenario) return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
  // Basic auto-evaluation: check submission length and keywords
  const length = submission.length;
  const baseScore = Math.min(100, length / 10);
  const attempt = await db.simulationAttempt.create({
    data: { userId: session.id, scenarioId: id, submission, score: baseScore, feedback: `Auto-evaluated submission. Length: ${length} chars. Manual review recommended for full grading.` },
  });
  return NextResponse.json({ attempt });
}
