import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock users (in a real app, this would be in a database)
interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  isVerified: boolean;
}

let mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    password: hashPassword('demo123', 'initial-salt'),
    isVerified: true
  }
];

function hashPassword(password: string, salt: string): string {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

function createJWT(user: Omit<User, 'password'>): string {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Rate limiting
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

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
    const { email, password } = await request.json();

    // Check rate limiting
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In a real app, you would use a proper password hashing library like bcrypt
    const hashedPassword = hashPassword(password, 'initial-salt');
    if (user.password !== hashedPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, error: 'Please verify your email before logging in' },
        { status: 401 }
      );
    }

    const token = createJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 