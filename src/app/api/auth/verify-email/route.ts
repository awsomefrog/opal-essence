import { NextRequest, NextResponse } from 'next/server';

// Mock users (in a real app, this would be in a database)
interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
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

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    const user = mockUsers.find(u => u.verificationToken === token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 