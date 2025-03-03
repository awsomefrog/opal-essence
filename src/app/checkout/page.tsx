'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { calculateShippingRates } from '../utils/shippingService';
import { calculateTax } from '../utils/taxService';
import { processPayment, PaymentMethod, validateCard, formatCardNumber, getCardType } from '../utils/paymentService';
import { createOrder, PaymentStatus } from '../utils/orderService';

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface FormErrors {
  [key: string]: string;
}

interface PaymentDetails {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  name: string;
  email: string;
}

export default function CheckoutPage() {
  const { items, itemCount, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    name: '',
    email: ''
  });

  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [taxInfo, setTaxInfo] = useState<{ taxRate: number; taxAmount: number }>({ taxRate: 0, taxAmount: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [cardType, setCardType] = useState<string>('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Validate form fields
  const validateForm = () => {
    const errors: FormErrors = {};
    
    // Shipping validation
    if (!shippingAddress.street.trim()) {
      errors.street = 'Street address is required';
    }
    if (!shippingAddress.city.trim()) {
      errors.city = 'City is required';
    }
    if (!shippingAddress.state.trim()) {
      errors.state = 'State is required';
    }
    if (!shippingAddress.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(shippingAddress.zipCode)) {
      errors.zipCode = 'Invalid ZIP code format';
    }
    if (!selectedShippingMethod) {
      errors.shipping = 'Please select a shipping method';
    }

    // Payment validation
    if (!paymentDetails.name.trim()) {
      errors.name = 'Cardholder name is required';
    }
    if (!paymentDetails.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentDetails.email)) {
      errors.email = 'Invalid email format';
    }

    const cardValidation = validateCard({
      number: paymentDetails.cardNumber.replace(/\s/g, ''),
      expMonth: parseInt(paymentDetails.expMonth),
      expYear: parseInt(paymentDetails.expYear),
      cvc: paymentDetails.cvc
    });

    if (!cardValidation.valid) {
      errors.card = cardValidation.error || 'Invalid card details';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Calculate shipping and tax when address changes
  useEffect(() => {
    const calculateRates = async () => {
      if (shippingAddress.state && shippingAddress.zipCode) {
        setIsLoading(true);
        try {
          // Get shipping rates
          const rates = await calculateShippingRates(
            { state: shippingAddress.state, zipCode: shippingAddress.zipCode },
            itemCount,
            subtotal
          );
          setShippingRates(rates);
          
          // Calculate tax
          const tax = await calculateTax(
            { state: shippingAddress.state, zipCode: shippingAddress.zipCode },
            subtotal
          );
          setTaxInfo(tax);
        } catch (error) {
          console.error('Error calculating rates:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    calculateRates();
  }, [shippingAddress.state, shippingAddress.zipCode, itemCount, subtotal]);

  // Update card type when number changes
  useEffect(() => {
    setCardType(getCardType(paymentDetails.cardNumber));
  }, [paymentDetails.cardNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setOrderProcessing(true);
    try {
      // Process payment
      const selectedRate = shippingRates.find(rate => rate.method === selectedShippingMethod);
      const total = subtotal + (selectedRate?.rate ?? 0) + taxInfo.taxAmount;

      const paymentResult = await processPayment(
        total * 100, // Convert to cents for Stripe
        'usd',
        {
          type: 'card',
          card: {
            number: paymentDetails.cardNumber.replace(/\s/g, ''),
            expMonth: parseInt(paymentDetails.expMonth),
            expYear: parseInt(paymentDetails.expYear),
            cvc: paymentDetails.cvc
          },
          billingDetails: {
            name: paymentDetails.name,
            email: paymentDetails.email,
            address: {
              line1: shippingAddress.street,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.zipCode,
              country: shippingAddress.country
            }
          }
        }
      );

      if (paymentResult.status === PaymentStatus.COMPLETED) {
        // Create order
        const order = await createOrder(
          items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          {
            ...shippingAddress,
            shippingMethod: selectedShippingMethod,
            estimatedDays: selectedRate?.estimatedDays || ''
          },
          {
            subtotal,
            shipping: selectedRate?.rate ?? 0,
            tax: taxInfo.taxAmount,
            total
          },
          paymentResult.status
        );

        // Clear cart and redirect to success page
        clearCart();
        window.location.href = `/orders/${order.id}`;
      } else {
        throw new Error(paymentResult.message);
      }
    } catch (error) {
      console.error('Error processing order:', error);
      alert(error instanceof Error ? error.message : 'There was an error processing your order. Please try again.');
    } finally {
      setOrderProcessing(false);
    }
  };

  const selectedRate = shippingRates.find(rate => rate.method === selectedShippingMethod);
  const shippingCost = selectedRate?.rate ?? 0;
  const total = subtotal + shippingCost + taxInfo.taxAmount;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentDetails(prev => ({ ...prev, cardNumber: formatted }));
  };

  if (itemCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <p className="text-gray-600">Your cart is empty. Please add items to proceed with checkout.</p>
        <a href="/products" className="inline-block mt-4 text-blue-600 hover:text-blue-800">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Shipping Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  className={`mt-1 block w-full border ${formErrors.street ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                />
                {formErrors.street && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.street}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  className={`mt-1 block w-full border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                />
                {formErrors.city && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  placeholder="2-letter state code (e.g., OR)"
                  className={`mt-1 block w-full border ${formErrors.state ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value.toUpperCase() })}
                  maxLength={2}
                />
                {formErrors.state && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.state}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  className={`mt-1 block w-full border ${formErrors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                />
                {formErrors.zipCode && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.zipCode}</p>
                )}
              </div>
            </form>
          </div>

          {/* Shipping Methods */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
            {isLoading ? (
              <p className="text-gray-600">Calculating shipping rates...</p>
            ) : (
              <div className="space-y-4">
                {shippingRates.map((rate) => (
                  <div key={rate.method} className="flex items-center">
                    <input
                      type="radio"
                      id={rate.method}
                      name="shippingMethod"
                      value={rate.method}
                      checked={selectedShippingMethod === rate.method}
                      onChange={(e) => setSelectedShippingMethod(e.target.value)}
                      className="h-4 w-4 text-gray-900 focus:ring-gray-500"
                    />
                    <label htmlFor={rate.method} className="ml-3 flex justify-between flex-1">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{rate.method}</p>
                        <p className="text-sm text-gray-500">
                          Estimated delivery: {rate.estimatedDays} business days
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {rate.rate === 0 ? 'FREE' : `$${rate.rate.toFixed(2)}`}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
            {formErrors.shipping && (
              <p className="mt-1 text-sm text-red-500">{formErrors.shipping}</p>
            )}
          </div>

          {/* Payment Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={`mt-1 block w-full border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                  value={paymentDetails.name}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`mt-1 block w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                  value={paymentDetails.email}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, email: e.target.value })}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                  Card Number {cardType && <span className="text-gray-500">({cardType})</span>}
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  className={`mt-1 block w-full border ${formErrors.card ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                  value={paymentDetails.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="expMonth" className="block text-sm font-medium text-gray-700">
                    Month
                  </label>
                  <input
                    type="text"
                    id="expMonth"
                    className={`mt-1 block w-full border ${formErrors.card ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                    value={paymentDetails.expMonth}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, expMonth: e.target.value })}
                    maxLength={2}
                    placeholder="MM"
                  />
                </div>

                <div>
                  <label htmlFor="expYear" className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <input
                    type="text"
                    id="expYear"
                    className={`mt-1 block w-full border ${formErrors.card ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                    value={paymentDetails.expYear}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, expYear: e.target.value })}
                    maxLength={2}
                    placeholder="YY"
                  />
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    className={`mt-1 block w-full border ${formErrors.card ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
                    value={paymentDetails.cvc}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cvc: e.target.value })}
                    maxLength={4}
                    placeholder="123"
                  />
                </div>
              </div>

              {formErrors.card && (
                <p className="mt-1 text-sm text-red-500">{formErrors.card}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={orderProcessing || isLoading}
            className={`w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 mt-8 ${
              (orderProcessing || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {orderProcessing ? 'Processing Order...' : `Pay $${total.toFixed(2)}`}
          </button>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping from Newberg, OR</span>
                  <span>
                    {selectedRate
                      ? selectedRate.rate === 0
                        ? 'FREE'
                        : `$${selectedRate.rate.toFixed(2)}`
                      : '-'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Tax ({(taxInfo.taxRate * 100).toFixed(1)}%)
                  </span>
                  <span>${taxInfo.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 mt-4 pt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>Shipping from: Newberg, OR 97132</p>
                {selectedRate && (
                  <p className="mt-2">
                    Estimated delivery: {selectedRate.estimatedDays} business days
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 