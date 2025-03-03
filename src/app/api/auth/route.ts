import { createHash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

// In a real app, this would be stored in a database
let mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    password: hashPassword('demo123', 'initial-salt'),
    isVerified: true
  }
];

// Rate limiting
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

function hashPassword(password: string, salt: string): string {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

function createJWT(user: Omit<User, 'password'>): string {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
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

async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@elegantjewelry.com',
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to Elegant Jewelry!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `
  });
}

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const userAttempts = loginAttempts.get(email);

  if (!userAttempts) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }

  if (userAttempts.count >= MAX_LOGIN_ATTEMPTS) {
    if (now - userAttempts.lastAttempt < LOCKOUT_TIME) {
      return false;
    }
    loginAttempts.delete(email);
    return true;
  }

  userAttempts.count += 1;
  userAttempts.lastAttempt = now;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, action } = await request.json();

    if (action === 'register') {
      // Check if user already exists
      if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
      }

      const salt = randomBytes(16).toString('hex');
      const hashedPassword = hashPassword(password, salt);
      const verificationToken = generateToken();

      const newUser: User = {
        id: generateToken(8),
        email,
        name,
        password: hashedPassword,
        isVerified: false,
        verificationToken
      };

      mockUsers.push(newUser);

      // Send verification email
      await sendVerificationEmail(email, verificationToken);

      const token = createJWT({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isVerified: newUser.isVerified
      });

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          isVerified: newUser.isVerified
        }
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 