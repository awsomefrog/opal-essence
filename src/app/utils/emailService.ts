'use client';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    return data.success;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function sendVerificationEmail(email: string, verificationToken: string): Promise<boolean> {
  const verificationUrl = `${window.location.origin}/verify-email?token=${verificationToken}`;
  
  return sendEmail({
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to Opal Essence!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>If you didn't create an account with us, you can safely ignore this email.</p>
    `,
  });
}

export function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;
  
  return sendEmail({
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `,
  });
}

export function sendOrderConfirmationEmail(email: string, order: any): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Order Confirmation - Opal Essence',
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order Number: ${order.id}</p>
      <p>We'll notify you when your order ships.</p>
      <h2>Order Details</h2>
      <ul>
        ${order.items.map((item: any) => `
          <li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
        `).join('')}
      </ul>
      <p>Subtotal: $${order.summary.subtotal.toFixed(2)}</p>
      <p>Shipping: $${order.summary.shipping.toFixed(2)}</p>
      <p>Tax: $${order.summary.tax.toFixed(2)}</p>
      <p><strong>Total: $${order.summary.total.toFixed(2)}</strong></p>
      <p>Shipping to:</p>
      <p>
        ${order.shipping.street}<br>
        ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}<br>
        ${order.shipping.country}
      </p>
    `,
  });
} 