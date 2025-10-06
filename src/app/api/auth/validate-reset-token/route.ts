// app/api/auth/validate-reset-token/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Validate reset token error:', error);
    return NextResponse.json(
      { error: 'Failed to validate reset token' },
      { status: 500 }
    );
  }
}