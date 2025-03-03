import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateCSRFToken, validateCSRFToken } from './app/utils/authService';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window

// Store rate limiting data (in a real app, use Redis)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

// Protected routes that require CSRF token
const protectedRoutes = [
  '/api/login',
  '/api/register',
  '/api/reset-password',
  '/api/forgot-password'
];

// Clean up expired rate limit entries
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }
}

// Check rate limit for an IP
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const data = rateLimitStore.get(ip);

  if (!data) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - data.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (data.count >= MAX_REQUESTS) {
    return false;
  }

  data.count += 1;
  return true;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get client IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  // Clean up expired rate limit entries periodically
  if (Math.random() < 0.1) { // 10% chance to trigger cleanup
    cleanupRateLimitStore();
  }

  // Check rate limit
  if (!checkRateLimit(ip)) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Handle CSRF protection for protected routes
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    const csrfToken = request.headers.get('X-CSRF-Token');

    // For GET requests, generate and set CSRF token
    if (request.method === 'GET') {
      const token = generateCSRFToken();
      response.headers.set('X-CSRF-Token', token);
    }
    // For other methods, validate CSRF token
    else if (!csrfToken || !validateCSRFToken(csrfToken)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Set security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 