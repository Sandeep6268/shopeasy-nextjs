// app/api/get-hashed-password/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    return NextResponse.json({
      success: true,
      password: password,
      hashedPassword: hashedPassword,
      instruction: 'Copy this hashed password to MongoDB Atlas'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to hash password'
    });
  }
}