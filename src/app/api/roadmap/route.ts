import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const profile = await db.studentProfile.findUnique({ where: { userId: session.id } });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  const roadmap = await db.careerRoadmap.findFirst({ where: { studentId: profile.id }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ roadmap });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const profile = await db.studentProfile.findUnique({ where: { userId: session.id } });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  const body = await req.json();
  const { goal, milestones, progress } = body;
  const existing = await db.careerRoadmap.findFirst({ where: { studentId: profile.id }, orderBy: { createdAt: 'desc' } });
  let roadmap;
  if (existing) {
    roadmap = await db.careerRoadmap.update({
      where: { id: existing.id },
      data: {
        ...(goal !== undefined && { goal }),
        ...(milestones !== undefined && { milestones: JSON.stringify(milestones) }),
        ...(progress !== undefined && { progress }),
      },
    });
  } else {
    roadmap = await db.careerRoadmap.create({
      data: { studentId: profile.id, goal: goal || 'Engineer', milestones: JSON.stringify(milestones || []), progress: progress || 0 },
    });
  }
  return NextResponse.json({ roadmap });
}
