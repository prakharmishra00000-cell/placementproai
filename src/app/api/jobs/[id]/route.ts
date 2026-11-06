// /api/jobs/[id]
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await db.jobListing.findUnique({ where: { id }, include: { company: true, drives: true } });
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    job: {
      ...job,
      requiredBranches: JSON.parse(job.requiredBranches || '[]'),
      requiredSkills: JSON.parse(job.requiredSkills || '[]'),
    },
  });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.jobListing.update({ where: { id }, data: { status: 'CLOSED' } });
  return NextResponse.json({ ok: true });
}
