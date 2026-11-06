// /api/resumes - resume CRUD
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const resumes = await db.resume.findMany({ where: { userId: session.id }, orderBy: { updatedAt: 'desc' } });
  return NextResponse.json({ resumes: resumes.map(r => ({ ...r, data: JSON.parse(r.data) })) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const body = await req.json();
  const { title = 'New Resume', template = 'ATS_CLASSIC', data, isPrimary = false } = body;
  if (isPrimary) {
    await db.resume.updateMany({ where: { userId: session.id }, data: { isPrimary: false } });
  }
  const resume = await db.resume.create({
    data: { userId: session.id, title, template, data: JSON.stringify(data || {}), isPrimary },
  });
  return NextResponse.json({ resume: { ...resume, data: JSON.parse(resume.data) } });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const body = await req.json();
  const { id, title, template, data, isPrimary } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if (isPrimary) {
    await db.resume.updateMany({ where: { userId: session.id }, data: { isPrimary: false } });
  }
  const resume = await db.resume.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(template !== undefined && { template }),
      ...(data !== undefined && { data: JSON.stringify(data) }),
      ...(isPrimary !== undefined && { isPrimary }),
    },
  });
  return NextResponse.json({ resume: { ...resume, data: JSON.parse(resume.data) } });
}
