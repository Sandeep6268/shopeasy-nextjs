// app/api/admin/users/[id]/orders/route.ts - USING EXISTING ORDERS API
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { validateAuthToken } from '@/lib/auth';
import User from '@/models/User';
import Order from '@/models/Order';

async function getTokenFromHeaders(): Promise<string | null> {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');
    if (!cookieHeader) return null;
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    
    return cookies.token || null;
  } catch (error) {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = validateAuthToken(token);
    
    // Verify admin access
    const adminUser = await User.findById(payload.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const userId = params.id;

    // Verify the target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Simple query - use the same field name as your main orders API
    const orders = await Order.find({ userId: userId })
      .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders for user ${userId}`);

    return NextResponse.json({ 
      orders: orders
    });
  } catch (error) {
    console.error('User orders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user orders' },
      { status: 500 }
    );
  }
}