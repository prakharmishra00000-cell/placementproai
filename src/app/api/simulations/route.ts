import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const branchCode = searchParams.get('branchCode');
  const where: any = {};
  if (branchCode) where.branchCode = branchCode;
  const sims = await db.simulationScenario.findMany({ where, orderBy: { title: 'asc' } });
  return NextResponse.json({ simulations: sims });
}
