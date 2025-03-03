import { createHash, randomBytes } from 'crypto';
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

function hashPassword(password: string, salt: string): string {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    const user = mockUsers.find(u => 
      u.resetPasswordToken === token && 
      u.resetPasswordExpires && 
      u.resetPasswordExpires > new Date()
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    const salt = randomBytes(16).toString('hex');
    user.password = hashPassword(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 