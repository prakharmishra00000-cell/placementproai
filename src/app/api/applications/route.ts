// /api/applications - apply & list
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const apps = await db.jobApplication.findMany({
    where: { userId: session.id },
    include: { job: { include: { company: true } } },
    orderBy: { appliedAt: 'desc' },
  });
  return NextResponse.json({ applications: apps });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { jobId } = await req.json();
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  // Prevent duplicates
  const existing = await db.jobApplication.findFirst({ where: { userId: session.id, jobId } });
  if (existing) return NextResponse.json({ error: 'Already applied' }, { status: 409 });
  const app = await db.jobApplication.create({ data: { userId: session.id, jobId, status: 'APPLIED' } });
  // Create notification
  const job = await db.jobListing.findUnique({ where: { id: jobId }, include: { company: true } });
  if (job) {
    await db.notification.create({
      data: { userId: session.id, title: 'Application submitted', message: `You applied for ${job.title} at ${job.company.name}.`, type: 'JOB' },
    });
  }
  return NextResponse.json({ application: app });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { id, status } = await req.json();
  if (!['RECRUITER', 'PLACEMENT_OFFICER', 'COLLEGE_ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  const app = await db.jobApplication.update({ where: { id }, data: { status } });
  // Notify student
  if (status === 'SHORTLISTED' || status === 'INTERVIEW' || status === 'OFFER' || status === 'REJECTED') {
    const job = await db.jobListing.findUnique({ where: { id: app.jobId }, include: { company: true } });
    await db.notification.create({
      data: {
        userId: app.userId,
        title: `Application ${status.toLowerCase()}`,
        message: `Your application for ${job?.title} at ${job?.company.name} is now ${status}.`,
        type: status === 'OFFER' ? 'OFFER' : status === 'INTERVIEW' ? 'INTERVIEW' : 'INFO',
      },
    });
  }
  return NextResponse.json({ application: app });
}
