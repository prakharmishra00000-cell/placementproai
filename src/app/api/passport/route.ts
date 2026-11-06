// /api/passport - digital credential passport
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const profile = await db.studentProfile.findUnique({
    where: { userId: session.id },
    include: { branch: true, college: true, credentials: true, skills: true },
  });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  return NextResponse.json({
    profile,
    passport: {
      id: profile.id,
      name: session.name,
      email: session.email,
      branch: profile.branch?.name,
      college: profile.college?.name,
      cgpa: profile.cgpa,
      semester: profile.semester,
      graduationYear: profile.graduationYear,
      skills: profile.skills,
      credentials: profile.credentials,
      issuedAt: new Date().toISOString(),
      verificationUrl: `/verify/${profile.id}`,
    },
  });
}
