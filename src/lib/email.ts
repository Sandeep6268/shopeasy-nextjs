// lib/email.ts
import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email server connection failed:', error);
  } else {
    //console.log('✅ Email server is ready to send messages');
  }
});

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
    to: email,
    subject: 'Reset Your Password - ShopEasy',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ShopEasy</h1>
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password for your ShopEasy account. Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" class="button" style="color: white; text-decoration: none;">
                Reset Your Password
              </a>
            </div>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <div class="footer">
              <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
              <p><a href="${resetLink}">${resetLink}</a></p>
              <p>Best regards,<br>The ShopEasy Team</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request - ShopEasy
      
      We received a request to reset your password for your ShopEasy account.
      
      Please use the following link to reset your password:
      ${resetLink}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request a password reset, please ignore this email.
      
      Best regards,
      The ShopEasy Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    //console.log('✅ Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
    to: email,
    subject: 'Welcome to ShopEasy!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ShopEasy! 🎉</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Welcome to ShopEasy! Your account has been successfully created.</p>
            <p>Start exploring our wide range of products and enjoy your shopping experience!</p>
            <p>Happy shopping!<br>The ShopEasy Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    //console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
  }
}