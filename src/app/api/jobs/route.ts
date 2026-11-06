// /api/jobs
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const branchCode = searchParams.get('branchCode');
  const jobType = searchParams.get('jobType');
  const location = searchParams.get('location');
  const minSalary = Number(searchParams.get('minSalary') || 0);
  const limit = Number(searchParams.get('limit') || 100);

  const all = await db.jobListing.findMany({
    where: { status: 'OPEN', salaryMin: { gte: minSalary } },
    include: { company: true },
    orderBy: { postedAt: 'desc' },
    take: limit,
  });

  let filtered = all;
  if (jobType) filtered = filtered.filter(j => j.jobType === jobType);
  if (location) filtered = filtered.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
  if (branchCode) {
    filtered = filtered.filter(j => {
      try {
        const branches: string[] = JSON.parse(j.requiredBranches);
        return branches.includes(branchCode) || branches.includes('ALL');
      } catch {
        return true;
      }
    });
  }

  return NextResponse.json({ jobs: filtered, count: filtered.length });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !['RECRUITER', 'PLACEMENT_OFFICER', 'COLLEGE_ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  const body = await req.json();
  const { title, companyId, description, location, jobType, experienceYears, salaryMin, salaryMax, requiredBranches, minCgpa, maxBacklogs, requiredSkills } = body;
  if (!title || !companyId) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  const job = await db.jobListing.create({
    data: {
      companyId, title, description, location, jobType: jobType || 'FULL_TIME',
      experienceYears: Number(experienceYears) || 0,
      salaryMin: Number(salaryMin) || 0, salaryMax: Number(salaryMax) || 0,
      requiredBranches: JSON.stringify(requiredBranches || []),
      minCgpa: Number(minCgpa) || 6.0, maxBacklogs: Number(maxBacklogs) || 0,
      requiredSkills: JSON.stringify(requiredSkills || []),
      status: 'OPEN',
    },
  });
  return NextResponse.json({ job });
}
