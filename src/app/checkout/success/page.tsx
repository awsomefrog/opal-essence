'use client';

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h1>
        <p className="text-gray-600 mb-8">
          Your order has been successfully placed. We'll send you an email with your order details
          and tracking information once your package ships from Newberg, Oregon.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Estimated delivery time will be calculated based on your location and shipping method.
          </p>
          <a
            href="/products"
            className="inline-block bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
} 