// app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/resend-email';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success to prevent email enumeration
    if (!user) {
    //   //console.log('❌ User not found for email:', email);
      return NextResponse.json({
        message: 'If an account with that email exists, we have sent a password reset link to your email.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // //console.log('📧 Attempting to send email to:', user.email);

    // Try to send email via Resend
    const emailSent = await sendPasswordResetEmail(user.email, resetToken);

    if (emailSent) {
    //   //console.log('✅ Email sent successfully');
      return NextResponse.json({
        message: 'Password reset link has been sent to your email.'
      });
    } else {
      // If email fails, return the reset link for testing
      const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
      
    //   //console.log('📧 Email service not configured. Reset link:', resetLink);
      
      return NextResponse.json({
        message: 'Email service is not configured. Use this reset link:',
        resetLink: resetLink,
        note: 'In production, this would be sent via email.'
      });
    }
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}