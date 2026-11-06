// /api/auth/register
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hash, setSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role = 'STUDENT', collegeId, branchId, semester, graduationYear } = body;
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    const user = await db.user.create({
      data: { email, passwordHash: hash(password), name, role, collegeId: collegeId || null },
    });

    if (role === 'STUDENT') {
      const fallbackCollege = await db.college.findFirst();
      await db.studentProfile.create({
        data: {
          userId: user.id,
          collegeId: collegeId || fallbackCollege!.id,
          branchId: branchId || null,
          semester: Number(semester) || 1,
          graduationYear: Number(graduationYear) || new Date().getFullYear() + 2,
          cgpa: 0, percentage: 0, activeBacklogs: 0, historyBacklogs: 0,
        },
      });
    }

    await setSession(user.id);
    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role, collegeId: user.collegeId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
