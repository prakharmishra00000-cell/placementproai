import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const branchId = searchParams.get('branchId');
  const semester = searchParams.get('semester');
  const isCommon = searchParams.get('isCommon');
  const collegeId = searchParams.get('collegeId');

  const where: any = {};
  if (branchId) where.branchId = branchId;
  if (semester) where.semester = Number(semester);
  if (isCommon === 'true') where.isCommon = true;
  if (isCommon === 'false') where.isCommon = false;

  const subjects = await db.subject.findMany({
    where,
    include: { branch: true, units: { include: { topics: { include: { subtopics: true } } } } },
    orderBy: [{ semester: 'asc' }, { code: 'asc' }],
  });

  // If collegeId passed, filter subjects to those whose branch is offered at the college
  let result = subjects;
  if (collegeId) {
    const cb = await db.collegeBranch.findMany({ where: { collegeId }, select: { branchId: true } });
    const branchIds = new Set(cb.map(c => c.branchId));
    result = subjects.filter(s => s.isCommon || branchIds.has(s.branchId));
  }

  return NextResponse.json({ subjects: result });
}
