import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // In a real app, validate against database
    // This is just a mock implementation
    if (email === 'test@example.com' && password === 'password') {
      const token = jwt.sign(
        { userId: uuidv4(), email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return NextResponse.json({
        success: true,
        token,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 