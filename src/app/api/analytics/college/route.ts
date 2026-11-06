// College admin / placement officer analytics
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || !['COLLEGE_ADMIN', 'PLACEMENT_OFFICER', 'SUPER_ADMIN'].includes(session.role)) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  const collegeId = session.collegeId;
  if (!collegeId) return NextResponse.json({ error: 'No college assigned' }, { status: 400 });

  // Get students of this college
  const students = await db.studentProfile.findMany({
    where: { collegeId },
    include: { branch: true, user: true },
  });
  const studentIds = students.map(s => s.userId);

  // Drives at this college
  const drives = await db.placementDrive.findMany({
    where: { collegeId },
    include: { company: true, job: true },
    orderBy: { createdAt: 'desc' },
  });

  // Applications from this college's students
  const applications = await db.jobApplication.findMany({
    where: { userId: { in: studentIds } },
    include: { job: { include: { company: true } }, user: true },
  });

  // Branch-wise counts
  const branchWise: Record<string, number> = {};
  for (const s of students) {
    const b = s.branch?.code || 'Unknown';
    branchWise[b] = (branchWise[b] || 0) + 1;
  }

  // Status counts
  const statusCounts: Record<string, number> = {};
  for (const a of applications) {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  }

  // Total placed (students with at least one OFFER)
  const studentsWithOffers = new Set(applications.filter(a => a.status === 'OFFER').map(a => a.userId));
  const placementRate = students.length > 0 ? Math.round((studentsWithOffers.size / students.length) * 100) : 0;

  return NextResponse.json({
    college: { id: collegeId },
    totals: {
      students: students.length,
      drives: drives.length,
      applications: applications.length,
      placementRate,
      offers: studentsWithOffers.size,
    },
    branchWise,
    statusCounts,
    drives: drives.slice(0, 20),
    applications: applications.slice(0, 50),
    students: students.map(s => ({
      id: s.id,
      name: s.user.name,
      email: s.user.email,
      branch: s.branch?.name,
      semester: s.semester,
      cgpa: s.cgpa,
      graduationYear: s.graduationYear,
      activeBacklogs: s.activeBacklogs,
      careerGoal: s.careerGoal,
      targetJob: s.targetJob,
      optedIn: s.optedIn,
    })),
  });
}
