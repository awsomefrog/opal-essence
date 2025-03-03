import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

// Mock users (in a real app, this would be in a database)
interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

let mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    password: 'hashed_password',
    isVerified: true
  }
];

function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@elegantjewelry.com',
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !user.isVerified) {
      // For security, don't reveal whether the email exists or is verified
      return NextResponse.json({ success: true });
    }

    const resetToken = generateToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 