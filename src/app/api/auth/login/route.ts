import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { createAuthToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  // //console.log('🚀 [LOGIN] API called');
  
  try {
    await dbConnect();
    // //console.log('✅ [LOGIN] Database connected');
    
    const body = await request.json();
    const { email, password } = body;
    
    // //console.log('🔍 [LOGIN] Request data:', { email, password: password ? '***' : 'missing' });

    // Validate input
    if (!email || !password) {
      // //console.log('❌ [LOGIN] Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    // //console.log('🔍 [LOGIN] Searching for user:', email);
    const user = await User.findOne({ email });
    if (!user) {
      // //console.log('❌ [LOGIN] User not found:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // //console.log('✅ [LOGIN] User found:', user._id);

    // Check password
    // //console.log('🔍 [LOGIN] Checking password...');
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // //console.log('❌ [LOGIN] Invalid password');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // //console.log('✅ [LOGIN] Password valid');

    // Generate JWT token
    // //console.log('🔍 [LOGIN] Generating token...');
    const token = await createAuthToken(user);
    // //console.log('✅ [LOGIN] Token generated, type:', typeof token);

    // Create response
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    const cookie = setAuthCookie(token);
    // //console.log('🔍 [LOGIN] Setting cookie');
    response.headers.set('Set-Cookie', cookie);

    // //console.log('✅ [LOGIN] Login successful for user:', user.email);
    return response;
  } catch (error: any) {
    console.error('❌ [LOGIN] Login error details:', error);
    console.error('❌ [LOGIN] Error stack:', error.stack);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}