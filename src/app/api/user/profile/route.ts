// app/api/user/profile/route.ts - FIXED
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
      if (name && value) {
        acc[name] = decodeURIComponent(value);
      }
      return acc;
    }, {} as Record<string, string>);
    
    return cookies.token || cookies.auth || null;
  } catch (error) {
    console.error('Token extraction error:', error);
    return null;
  }
}

// GET user profile with stats
export async function GET() {
  try {
    await dbConnect();
    // //console.log('🔍 GET /api/user/profile - Connecting to database...');

    const token = await getTokenFromHeaders();
    // //console.log('🔍 Token found:', !!token);
    
    if (!token) {
    //   //console.log('❌ No token found');
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const payload = validateAuthToken(token);
    // //console.log('🔍 Token payload:', payload);
    
    if (!payload || !payload.userId) {
    //   //console.log('❌ Invalid token payload');
      return NextResponse.json(
        { error: 'Invalid authentication token' }, 
        { status: 401 }
      );
    }

    const user = await User.findById(payload.userId).select('-password');
    // //console.log('🔍 User found:', !!user);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    // Get user stats
    const ordersCount = await Order.countDocuments({ userId: user._id });
    const wishlistCount = user.wishlist ? user.wishlist.length : 0;

    // //console.log('✅ Profile data fetched successfully');
    
    return NextResponse.json({
      success: true,
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
    console.error('❌ Profile fetch error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch profile',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// UPDATE user profile
export async function PUT(request: Request) {
  try {
    await dbConnect();
    // //console.log('🔍 PUT /api/user/profile - Updating profile...');

    const token = await getTokenFromHeaders();
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const payload = validateAuthToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Invalid authentication token' }, 
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { name } = body;
    // //console.log('🔍 Update data:', { name });

    // Validate input
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and cannot be empty' },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      payload.userId,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    // Get updated stats
    const ordersCount = await Order.countDocuments({ userId: user._id });
    const wishlistCount = user.wishlist ? user.wishlist.length : 0;

    // //console.log('✅ Profile updated successfully');

    return NextResponse.json({
      success: true,
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
    console.error('❌ Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update profile',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}