// lib/resend-email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  // Check if API key is set
  if (!process.env.RESEND_API_KEY) {
    //console.log('❌ RESEND_API_KEY not set in environment variables');
    return false;
  }

  const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'ShopEasy <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Your Password - ShopEasy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🛍️ ShopEasy</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <p style="margin-bottom: 15px;"><strong>Hello,</strong></p>
            <p style="margin-bottom: 20px;">We received a request to reset your password. Click the button below:</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Reset Your Password
              </a>
            </div>
            
            <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 12px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #666;">🔒 <strong>Note:</strong> This link expires in 1 hour.</p>
            </div>
            
            <p style="color: #666; margin-top: 25px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>Best regards,<br><strong>The ShopEasy Team</strong></p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return false;
    }

    //console.log('✅ Email sent successfully via Resend. Email ID:', data?.id);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}