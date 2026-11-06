// Placement drives - create / list
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const drives = await db.placementDrive.findMany({
    include: { company: true, job: true, college: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ drives });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !['PLACEMENT_OFFICER', 'COLLEGE_ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  const body = await req.json();
  const { collegeId, companyId, jobId, title, description, visitDate } = body;
  if (!collegeId || !companyId || !title) return NextResponse.json({ error: 'Missing required' }, { status: 400 });
  const drive = await db.placementDrive.create({
    data: {
      collegeId, companyId, jobId: jobId || null, title, description: description || '',
      visitDate: visitDate ? new Date(visitDate) : null,
    },
  });
  return NextResponse.json({ drive });
}
