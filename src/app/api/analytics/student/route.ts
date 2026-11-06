// Student analytics dashboard
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const profile = await db.studentProfile.findUnique({
    where: { userId: session.id },
    include: { branch: true, college: true, skills: true, credentials: true, enrollments: true },
  });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const tests = await db.testSession.findMany({
    where: { userId: session.id, completedAt: { not: null } },
    orderBy: { completedAt: 'desc' },
    take: 50,
  });
  const attempts = await db.questionAttempt.findMany({ where: { userId: session.id }, take: 500 });
  const apps = await db.jobApplication.findMany({ where: { userId: session.id }, include: { job: { include: { company: true } } } });
  const challenges = await db.challengeAttempt.findMany({ where: { userId: session.id } });
  const gap = await db.skillGap.findFirst({ where: { studentId: profile.id }, orderBy: { createdAt: 'desc' } });
  const roadmap = await db.careerRoadmap.findFirst({ where: { studentId: profile.id }, orderBy: { createdAt: 'desc' } });

  // Compute metrics
  const avgAccuracy = tests.length > 0 ? Math.round((tests.reduce((a, t) => a + t.accuracy, 0) / tests.length) * 100) : 0;
  const totalCorrect = attempts.filter(a => a.isCorrect).length;
  const totalAttempts = attempts.length;
  const accuracyPct = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const streak = challenges.filter(c => c.isCorrect).length;

  // Subject mastery from enrollments
  const masteryBySubject = profile.enrollments.map(e => ({
    subjectId: e.subjectId,
    progress: e.progress,
    mastery: e.mastery,
  }));

  // Score trend
  const scoreTrend = tests.slice(0, 10).reverse().map((t, i) => ({
    label: `Test ${i + 1}`,
    score: t.score,
    max: t.maxScore,
    accuracy: Math.round(t.accuracy * 100),
  }));

  return NextResponse.json({
    user: { name: session.name, email: session.email, role: session.role },
    profile,
    stats: {
      testsTaken: tests.length,
      avgAccuracy,
      totalQuestions: totalAttempts,
      correctAnswers: totalCorrect,
      accuracyPct,
      challengesCompleted: challenges.length,
      streak,
      applicationsCount: apps.length,
      applicationsByStatus: apps.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {} as Record<string, number>),
    },
    skillGap: gap ? {
      targetRole: gap.targetRole,
      readinessPct: gap.readinessPct,
      requiredSkills: JSON.parse(gap.requiredSkills || '[]'),
      missingSkills: JSON.parse(gap.missingSkills || '[]'),
      existingSkills: JSON.parse(gap.existingSkills || '[]'),
    } : null,
    roadmap: roadmap ? {
      goal: roadmap.goal,
      progress: roadmap.progress,
      milestones: JSON.parse(roadmap.milestones || '[]'),
    } : null,
    scoreTrend,
    masteryBySubject,
    recentApplications: apps.slice(0, 10).map(a => ({
      id: a.id, status: a.status, appliedAt: a.appliedAt,
      jobTitle: a.job.title, company: a.job.company.name, location: a.job.location,
    })),
  });
}
