'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Order, OrderStatus, PaymentStatus } from '../utils/orderService';

// Add dynamic export
export const dynamic = 'force-dynamic';

// In a real app, this would be fetched from an API
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'EJ-20240315-0001',
    items: [
      { id: 1, name: 'Diamond Pendant Necklace', price: 1299, quantity: 1 }
    ],
    shipping: {
      street: '123 Main St',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'US',
      shippingMethod: 'Ground Shipping',
      estimatedDays: '2-3'
    },
    summary: {
      subtotal: 1299,
      shipping: 15,
      tax: 0,
      total: 1314
    },
    status: OrderStatus.SHIPPED,
    trackingNumber: '1Z999AA10123456784',
    createdAt: '2024-03-15T10:30:00Z',
    estimatedDelivery: '2024-03-18',
    paymentStatus: PaymentStatus.COMPLETED
  }
];

function OrdersContent() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check authentication on client side
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return false;
        }

        // Decode JWT token to get user info
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        const { userId, email } = JSON.parse(jsonPayload);
        setUser({ name: email.split('@')[0] }); // Simple name from email
        return true;
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/login');
        return false;
      }
    };

    const isAuthenticated = checkAuth();
    setIsAuth(isAuthenticated);

    if (isAuthenticated) {
      // Simulate API call
      const fetchOrders = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
        setLoading(false);
      };

      fetchOrders();
    }
  }, [router]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.SHIPPED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.PROCESSING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuth) {
    return null; // Let the router handle redirection
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <a
            href="/products"
            className="inline-block bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
        <div className="text-sm text-gray-600">
          Welcome back, {user?.name}
        </div>
      </div>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Order #{order.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Order Details</h3>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>Total: ${order.summary.total.toLocaleString()}</p>
                      <p>Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                      <p>Shipping Method: {order.shipping.shippingMethod}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>{order.shipping.street}</p>
                      <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
                      <p>{order.shipping.country}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {order.status === OrderStatus.SHIPPED && (
                      <p>
                        Tracking Number: {order.trackingNumber}
                        <br />
                        Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <a
                    href={`/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details →
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
} 