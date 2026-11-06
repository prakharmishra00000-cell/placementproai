import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get('subjectId');
  const branchId = searchParams.get('branchId');
  const difficulty = searchParams.get('difficulty');
  const isCommon = searchParams.get('isCommon');
  const limit = Number(searchParams.get('limit') || 50);

  const where: any = {};
  if (subjectId) where.subjectId = subjectId;
  if (branchId) where.branchId = branchId;
  if (difficulty) where.difficulty = difficulty;
  if (isCommon === 'true') where.subject = { isCommon: true };

  const questions = await db.question.findMany({
    where,
    include: { subject: true, topic: true, branch: true },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ questions, count: questions.length });
}

export async function POST(req: NextRequest) {
  // Faculty only - create question
  const body = await req.json();
  const { subjectId, type, difficulty, text, options, correctAnswer, explanation, branchId, topicId } = body;
  if (!subjectId || !text || !correctAnswer) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const q = await db.question.create({
    data: { subjectId, topicId, branchId, type: type || 'MCQ', difficulty: difficulty || 'EASY', text, options: options || '[]', correctAnswer, explanation, verificationStatus: 'DRAFT' },
  });
  return NextResponse.json({ question: q });
}
