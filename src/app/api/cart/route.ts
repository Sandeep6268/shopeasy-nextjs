// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { validateAuthToken } from '@/lib/auth';
import User from '@/models/User';

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

// GET - Get user's cart
export async function GET() {
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();
    if (!token) {
      return NextResponse.json({ cart: { items: [], total: 0, itemCount: 0 } }, { status: 200 });
    }

    const payload = validateAuthToken(token);
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ cart: { items: [], total: 0, itemCount: 0 } }, { status: 200 });
    }

    // Ensure cart exists and has proper structure
    const cart = user.cart || { items: [], total: 0, itemCount: 0 };
    
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Update user's cart
export async function POST(request: Request) {
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = validateAuthToken(token);
    const { cart } = await request.json();

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart data is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user's cart
    user.cart = {
      items: cart.items || [],
      total: cart.total || 0,
      itemCount: cart.itemCount || 0,
    };

    await user.save();

    return NextResponse.json({ 
      message: 'Cart updated successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}