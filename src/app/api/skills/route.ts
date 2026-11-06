// /api/skills - student skill twin
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const profile = await db.studentProfile.findUnique({
    where: { userId: session.id },
    include: { skills: true, branch: true, credentials: true, enrollments: true },
  });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  // Compute skill summary
  const byCat: Record<string, any[]> = {};
  for (const s of profile.skills) {
    if (!byCat[s.category]) byCat[s.category] = [];
    byCat[s.category].push(s);
  }
  const verifiedCount = profile.skills.filter(s => s.verifiedBy && s.verifiedBy !== 'SELF').length;
  const overall = profile.skills.length > 0 ? profile.skills.reduce((a, b) => a + b.proficiency, 0) / profile.skills.length : 0;

  return NextResponse.json({
    profile,
    skillsByCategory: byCat,
    skillCount: profile.skills.length,
    verifiedCount,
    overallReadiness: Math.round(overall * 100),
    credentials: profile.credentials,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const body = await req.json();
  const profile = await db.studentProfile.findUnique({ where: { userId: session.id } });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const { name, category, proficiency, verifiedBy = 'SELF' } = body;
  if (!name || !category) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const existing = await db.studentSkill.findFirst({ where: { studentId: profile.id, name } });
  let skill;
  if (existing) {
    skill = await db.studentSkill.update({ where: { id: existing.id }, data: { proficiency, verifiedBy } });
  } else {
    skill = await db.studentSkill.create({ data: { studentId: profile.id, name, category, proficiency, verifiedBy } });
  }
  return NextResponse.json({ skill });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const skillId = searchParams.get('id');
  if (!skillId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await db.studentSkill.delete({ where: { id: skillId } });
  return NextResponse.json({ ok: true });
}
