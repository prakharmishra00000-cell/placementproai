// Super admin analytics
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  const [colleges, users, students, branches, jobs, companies, drives, apps, challenges, simulations, projects, aiConvs, plans] = await Promise.all([
    db.college.count(),
    db.user.count(),
    db.studentProfile.count(),
    db.branch.count(),
    db.jobListing.count(),
    db.company.count(),
    db.placementDrive.count(),
    db.jobApplication.count(),
    db.dailyChallenge.count(),
    db.simulationScenario.count(),
    db.projectListing.count(),
    db.aiConversation.count(),
    db.subscriptionPlan.findMany(),
  ]);

  // Role breakdown
  const usersByRole = await db.user.groupBy({ by: ['role'], _count: { role: true } });
  const roleCounts: Record<string, number> = {};
  for (const u of usersByRole) roleCounts[u.role] = u._count.role;

  // College plan breakdown
  const collegesByPlan = await db.college.groupBy({ by: ['plan'], _count: { plan: true } });
  const planCounts: Record<string, number> = {};
  for (const c of collegesByPlan) planCounts[c.plan] = c._count.plan;

  return NextResponse.json({
    totals: { colleges, users, students, branches, jobs, companies, drives, applications: apps, challenges, simulations, projects, aiConversations: aiConvs },
    roleCounts,
    planCounts,
    plans,
  });
}
