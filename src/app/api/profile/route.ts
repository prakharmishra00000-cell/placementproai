// Update student profile (onboarding + settings)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const profile = await db.studentProfile.findUnique({
    where: { userId: session.id },
    include: { branch: true, college: true },
  });
  return NextResponse.json({ profile });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const body = await req.json();
  let profile = await db.studentProfile.findUnique({ where: { userId: session.id } });
  if (!profile) {
    const fallbackCollege = await db.college.findFirst();
    profile = await db.studentProfile.create({
      data: { userId: session.id, collegeId: body.collegeId || fallbackCollege!.id, graduationYear: body.graduationYear || new Date().getFullYear() + 2 },
    });
  }
  const {
    collegeId, branchId, semester, regulation, cgpa, percentage,
    activeBacklogs, historyBacklogs, graduationYear, careerGoal,
    targetJob, linkedinUrl, githubUrl, bio, optedIn, language, specialization,
  } = body;
  profile = await db.studentProfile.update({
    where: { userId: session.id },
    data: {
      ...(collegeId !== undefined && { collegeId }),
      ...(branchId !== undefined && { branchId }),
      ...(specialization !== undefined && { specialization }),
      ...(semester !== undefined && { semester: Number(semester) }),
      ...(regulation !== undefined && { regulation }),
      ...(cgpa !== undefined && { cgpa: Number(cgpa) }),
      ...(percentage !== undefined && { percentage: Number(percentage) }),
      ...(activeBacklogs !== undefined && { activeBacklogs: Number(activeBacklogs) }),
      ...(historyBacklogs !== undefined && { historyBacklogs: Number(historyBacklogs) }),
      ...(graduationYear !== undefined && { graduationYear: Number(graduationYear) }),
      ...(careerGoal !== undefined && { careerGoal }),
      ...(targetJob !== undefined && { targetJob }),
      ...(linkedinUrl !== undefined && { linkedinUrl }),
      ...(githubUrl !== undefined && { githubUrl }),
      ...(bio !== undefined && { bio }),
      ...(optedIn !== undefined && { optedIn: Boolean(optedIn) }),
      ...(language !== undefined && { language }),
    },
  });
  // Auto-enroll in subjects for chosen branch+semester
  if (branchId) {
    const subjects = await db.subject.findMany({
      where: { OR: [{ branchId }, { isCommon: true }], semester: Number(semester) || profile.semester },
    });
    for (const s of subjects) {
      const ex = await db.studentEnrollment.findFirst({ where: { studentId: profile.id, subjectId: s.id } });
      if (!ex) await db.studentEnrollment.create({ data: { studentId: profile.id, subjectId: s.id } });
    }
  }
  return NextResponse.json({ profile });
}
