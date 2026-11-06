import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const branchCode = searchParams.get('branchCode');
  const where: any = {};
  if (branchCode) where.branchCode = branchCode;
  const projects = await db.projectListing.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({
    projects: projects.map(p => ({
      ...p,
      requiredSkills: JSON.parse(p.requiredSkills || '[]'),
    })),
  });
}
