import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const plans = await db.subscriptionPlan.findMany({ orderBy: { priceMonthly: 'asc' } });
  return NextResponse.json({ plans });
}
