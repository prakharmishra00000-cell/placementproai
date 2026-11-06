// Recruiter analytics - candidate discovery + their jobs
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || !['RECRUITER', 'SUPER_ADMIN'].includes(session.role)) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  const recruiter = await db.recruiter.findUnique({ where: { userId: session.id }, include: { company: true } });
  if (!recruiter) return NextResponse.json({ error: 'No recruiter profile' }, { status: 404 });

  const jobs = await db.jobListing.findMany({
    where: { companyId: recruiter.companyId },
    include: { company: true, applications: { include: { user: true } } },
  });

  // All opted-in students for talent search
  const optedInStudents = await db.studentProfile.findMany({
    where: { optedIn: true },
    include: { branch: true, college: true, user: true, skills: true },
    take: 200,
  });

  const totalApps = jobs.reduce((sum, j) => sum + j.applications.length, 0);
  const byStatus: Record<string, number> = {};
  for (const j of jobs) {
    for (const a of j.applications) byStatus[a.status] = (byStatus[a.status] || 0) + 1;
  }

  return NextResponse.json({
    company: recruiter.company,
    totals: { jobs: jobs.length, applications: totalApps, candidates: optedInStudents.length },
    byStatus,
    jobs: jobs.map(j => ({
      id: j.id, title: j.title, location: j.location, jobType: j.jobType,
      salaryMin: j.salaryMin, salaryMax: j.salaryMax,
      requiredBranches: JSON.parse(j.requiredBranches || '[]'),
      requiredSkills: JSON.parse(j.requiredSkills || '[]'),
      applicationsCount: j.applications.length,
      applications: j.applications.map(a => ({ id: a.id, status: a.status, appliedAt: a.appliedAt, user: { name: a.user.name, email: a.user.email } })),
    })),
    candidates: optedInStudents.map(s => ({
      id: s.id, name: s.user.name, branch: s.branch?.name, semester: s.semester,
      cgpa: s.cgpa, college: s.college?.name, graduationYear: s.graduationYear,
      activeBacklogs: s.activeBacklogs, targetJob: s.targetJob,
      skills: s.skills.map(sk => ({ name: sk.name, proficiency: sk.proficiency, verifiedBy: sk.verifiedBy })),
    })),
  });
}
