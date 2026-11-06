// /api/jobs/[id]/eligibility - eligibility engine
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const { id } = await params;
  const job = await db.jobListing.findUnique({ where: { id }, include: { company: true } });
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  const profile = await db.studentProfile.findUnique({
    where: { userId: session.id },
    include: { branch: true, skills: true },
  });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const requiredBranches: string[] = JSON.parse(job.requiredBranches || '[]');
  const requiredSkills: string[] = JSON.parse(job.requiredSkills || '[]');

  const reasons: any[] = [];
  let eligible = true;
  let needsVerification = false;

  // Branch check
  if (requiredBranches.length > 0 && profile.branch && !requiredBranches.includes(profile.branch.code)) {
    eligible = false;
    reasons.push({ rule: 'BRANCH', required: requiredBranches.join(', '), actual: profile.branch?.code, status: 'FAIL' });
  } else {
    reasons.push({ rule: 'BRANCH', required: requiredBranches.join(', '), actual: profile.branch?.code, status: 'PASS' });
  }

  // CGPA
  if (profile.cgpa < job.minCgpa) {
    eligible = false;
    reasons.push({ rule: 'MIN_CGPA', required: job.minCgpa, actual: profile.cgpa, status: 'FAIL' });
  } else {
    reasons.push({ rule: 'MIN_CGPA', required: job.minCgpa, actual: profile.cgpa, status: 'PASS' });
  }

  // Backlogs
  if (profile.activeBacklogs > job.maxBacklogs) {
    eligible = false;
    reasons.push({ rule: 'ACTIVE_BACKLOGS', required: `≤ ${job.maxBacklogs}`, actual: profile.activeBacklogs, status: 'FAIL' });
  } else {
    reasons.push({ rule: 'ACTIVE_BACKLOGS', required: `≤ ${job.maxBacklogs}`, actual: profile.activeBacklogs, status: 'PASS' });
  }

  // Skills - check missing
  const existingSkills = profile.skills.map(s => s.name);
  const missingSkills = requiredSkills.filter(r => !existingSkills.includes(r));
  if (missingSkills.length > 0) {
    needsVerification = true;
    reasons.push({ rule: 'SKILLS', required: requiredSkills.join(', '), actual: existingSkills.filter(s => requiredSkills.includes(s)).join(', '), missing: missingSkills, status: 'PARTIAL' });
  } else {
    reasons.push({ rule: 'SKILLS', required: requiredSkills.join(', '), actual: existingSkills.join(', '), status: 'PASS' });
  }

  // Graduation year - if job has expected grad year, check
  if (job.expiresAt && profile.graduationYear) {
    reasons.push({ rule: 'GRADUATION_YEAR', required: 'any', actual: profile.graduationYear, status: 'PASS' });
  } else {
    reasons.push({ rule: 'GRADUATION_YEAR', required: 'any', actual: profile.graduationYear, status: 'PASS' });
  }

  const status = eligible ? (needsVerification ? 'NEEDS_VERIFICATION' : 'ELIGIBLE') : 'NOT_ELIGIBLE';

  return NextResponse.json({
    eligible,
    status,
    needsVerification,
    reasons,
    job: { id: job.id, title: job.title, company: job.company.name, location: job.location },
  });
}
