import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendWelcomeEmail } from '@/lib/resend-email';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { name, email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create new user with properly initialized cart
    const user = await User.create({
      name,
      email,
      password,
      cart: {
        items: [],
        total: 0,
        itemCount: 0,
      },
      wishlist: [],
    });

    console.log('✅ [REGISTER] User created with ID:', user._id);
    await sendWelcomeEmail(user.email, user.name);

    // Return success response WITHOUT setting cookie or token
    return NextResponse.json(
      { 
        message: 'Account created successfully! Please sign in.',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ [REGISTER] Registration error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}