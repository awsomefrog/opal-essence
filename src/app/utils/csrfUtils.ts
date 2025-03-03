export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function validateCSRFToken(token: string): boolean {
  // In a real app, this would validate against a stored token
  return token.length === 64; // Simple validation for demo
} 