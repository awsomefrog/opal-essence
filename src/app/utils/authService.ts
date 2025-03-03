'use client';

import { createHash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

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

interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
}

interface LoginResponse {
  token?: string;
  error?: string;
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

function verifyJWT(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
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

export async function register(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  // Check if user already exists
  if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return {
      success: false,
      error: 'Email already registered'
    };
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

  return {
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      isVerified: newUser.isVerified
    }
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return {
      success: true,
      token: data.token,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during login',
    };
  }
}

export function logout(): void {
  localStorage.removeItem('token');
}

export function getCurrentUser(): Omit<User, 'password'> | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = verifyJWT(token);
  if (!decoded) {
    localStorage.removeItem('token');
    return null;
  }

  const user = mockUsers.find(u => u.id === decoded.userId);
  if (!user) {
    localStorage.removeItem('token');
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isVerified: user.isVerified
  };
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function verifyEmail(token: string): Promise<boolean> {
  const user = mockUsers.find(u => u.verificationToken === token);
  if (!user) return false;

  user.isVerified = true;
  user.verificationToken = undefined;
  return true;
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !user.isVerified) return false;

  const resetToken = generateToken();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

  await sendPasswordResetEmail(email, resetToken);
  return true;
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const user = mockUsers.find(u => 
    u.resetPasswordToken === token && 
    u.resetPasswordExpires && 
    u.resetPasswordExpires > new Date()
  );

  if (!user) return false;

  const salt = randomBytes(16).toString('hex');
  user.password = hashPassword(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  return true;
}

// CSRF Protection
export function generateCSRFToken(): string {
  return generateToken();
}

export function validateCSRFToken(token: string): boolean {
  // In a real app, this would validate against a stored token
  return token.length === 64; // Simple validation for demo
} 