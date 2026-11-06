// Admin: list & create colleges
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  const colleges = await db.college.findMany({
    include: { _count: { select: { users: true, students: true, placementDrives: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ colleges });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  const body = await req.json();
  const { name, shortName, domain, city, state, plan = 'FREE' } = body;
  if (!name || !domain) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const college = await db.college.create({ data: { name, shortName: shortName || name, domain, city, state, plan } });
  // Link all branches
  const branches = await db.branch.findMany();
  const dept = await db.department.create({ data: { collegeId: college.id, name: 'School of Engineering' } });
  for (const b of branches) {
    await db.collegeBranch.create({ data: { collegeId: college.id, branchId: b.id, departmentId: dept.id } });
  }
  return NextResponse.json({ college });
}
