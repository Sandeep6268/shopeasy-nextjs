// app/api/sync-ratings/route.ts
import { NextResponse } from 'next/server';
import { syncProductRatings } from '@/utils/syncProductRatings';

export async function GET() {
  try {
    await syncProductRatings();
    return NextResponse.json({ message: 'Ratings sync completed' });
  } catch (error) {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}