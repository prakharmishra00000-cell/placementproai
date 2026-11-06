import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subject = await db.subject.findUnique({
    where: { id },
    include: { branch: true, units: { include: { topics: { include: { subtopics: true } } } }, questions: true },
  });
  if (!subject) return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
  return NextResponse.json({ subject });
}
