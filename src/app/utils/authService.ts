'use client';

interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
  user?: User;
}

export async function register(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, action: 'register' }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during registration',
    };
  }
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
      user: data.user,
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

export function getCurrentUser(): User | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // Decode the JWT token to get user information
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const { userId, email } = JSON.parse(jsonPayload);
    
    // In a real app, you would make an API call to get the full user profile
    return {
      id: userId,
      email,
      name: '', // This would come from the API
      isVerified: true // This would come from the API
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem('token');
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function verifyEmail(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verifying email:', error);
    return false;
  }
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return false;
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
} 