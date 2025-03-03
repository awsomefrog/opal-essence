import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateCSRFToken, validateCSRFToken } from './app/utils/csrfUtils';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100;

// Store rate limit data in memory (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([key, value]) => {
    if (now - value.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  });
}, RATE_LIMIT_WINDOW);

// Routes that require CSRF protection
const protectedRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/reset-password',
  '/api/checkout',
  '/api/orders',
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Check rate limit
  const ip = request.ip || 'unknown';
  const rateLimit = rateLimitStore.get(ip) || { count: 0, timestamp: Date.now() };

  if (Date.now() - rateLimit.timestamp > RATE_LIMIT_WINDOW) {
    // Reset if window has passed
    rateLimit.count = 1;
    rateLimit.timestamp = Date.now();
  } else {
    rateLimit.count++;
    if (rateLimit.count > MAX_REQUESTS) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }
  rateLimitStore.set(ip, rateLimit);

  // CSRF protection for protected routes
  const path = request.nextUrl.pathname;
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (request.method === 'GET') {
      // For GET requests, set a new CSRF token
      const csrfToken = generateCSRFToken();
      response.cookies.set('CSRF-Token', csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    } else {
      // For non-GET requests, validate the token
      const csrfToken = request.headers.get('X-CSRF-Token');
      const storedToken = request.cookies.get('CSRF-Token')?.value;

      if (!csrfToken || !storedToken || !validateCSRFToken(csrfToken) || csrfToken !== storedToken) {
        return new NextResponse('Invalid CSRF Token', { status: 403 });
      }
    }
  }

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