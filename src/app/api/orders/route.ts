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

// GET - Get user's orders
export async function GET() {
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = validateAuthToken(token);
    const orders = await Order.find({ userId: payload.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST - Create new order
export async function POST(request: Request) {
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = validateAuthToken(token);
    const { items, shippingInfo, total } = await request.json();

    // Create order
    const order = await Order.create({
      userId: payload.userId,
      items,
      shippingInfo,
      total,
      status: 'processing',
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });

    return NextResponse.json({ 
      message: 'Order created successfully',
      order 
    }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}