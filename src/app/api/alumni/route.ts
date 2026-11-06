import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const alumni = await db.alumniProfile.findMany({
    include: { user: true },
    orderBy: { graduationYear: 'desc' },
  });
  return NextResponse.json({ alumni });
}
