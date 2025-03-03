import { loadStripe } from '@stripe/stripe-js';
import { PaymentStatus } from './orderService';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export interface PaymentMethod {
  type: 'card';
  card: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  };
  billingDetails: {
    name: string;
    email: string;
    address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export interface PaymentResult {
  status: PaymentStatus;
  transactionId: string;
  message: string;
}

export async function processPayment(
  amount: number,
  currency: string = 'usd',
  paymentMethod: PaymentMethod
): Promise<PaymentResult> {
  try {
    // In a real implementation, you would:
    // 1. Create a payment intent on your server
    // 2. Confirm the payment with Stripe
    // 3. Handle the result
    
    // Simulated payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate success (in reality, this would come from Stripe)
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      return {
        status: PaymentStatus.COMPLETED,
        transactionId: `tr_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Payment processed successfully'
      };
    } else {
      throw new Error('Payment declined');
    }
  } catch (error) {
    return {
      status: PaymentStatus.FAILED,
      transactionId: '',
      message: error instanceof Error ? error.message : 'Payment processing failed'
    };
  }
}

export function validateCard(card: PaymentMethod['card']): { valid: boolean; error?: string } {
  // Basic validation
  if (!/^\d{16}$/.test(card.number.replace(/\s/g, ''))) {
    return { valid: false, error: 'Invalid card number' };
  }

  if (card.expMonth < 1 || card.expMonth > 12) {
    return { valid: false, error: 'Invalid expiration month' };
  }

  const currentYear = new Date().getFullYear() % 100;
  if (card.expYear < currentYear) {
    return { valid: false, error: 'Card has expired' };
  }

  if (!/^\d{3,4}$/.test(card.cvc)) {
    return { valid: false, error: 'Invalid CVC' };
  }

  return { valid: true };
}

// Format card number with spaces
export function formatCardNumber(number: string): string {
  const cleaned = number.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
}

// Get card type based on number
export function getCardType(number: string): string {
  const cleaned = number.replace(/\D/g, '');
  
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  
  return 'Unknown';
} 