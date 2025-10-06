// app/api/user/profile/route.ts
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

// GET user profile with stats
export async function GET() {
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = validateAuthToken(token);
    const user = await User.findById(payload.userId).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user stats
    const ordersCount = await Order.countDocuments({ userId: user._id });
    const wishlistCount = user.wishlist ? user.wishlist.length : 0;

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        ordersCount,
        wishlistCount,
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// UPDATE user profile
export async function PUT(request: Request) {
  try {
    await dbConnect();

    const token = await getTokenFromHeaders();
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = validateAuthToken(token);
    const { name } = await request.json();

    // Validate input
    if (name && name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name cannot be empty' },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      payload.userId,
      { name: name?.trim() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get updated stats
    const ordersCount = await Order.countDocuments({ userId: user._id });
    const wishlistCount = user.wishlist ? user.wishlist.length : 0;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        ordersCount,
        wishlistCount,
      }
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}