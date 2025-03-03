'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Order, getOrder, getOrderTracking, OrderStatus } from '../../utils/orderService';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const orderData = await getOrder(orderId);
        const trackingData = await getOrderTracking(orderId);
        
        if (!orderData) {
          setError('Order not found');
          return;
        }

        setOrder(orderData);
        setTracking(trackingData);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <a href="/orders" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            View All Orders
          </a>
        </div>
      </div>
    );
  }

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <p className="text-gray-600 mt-2">Order #{order.orderNumber}</p>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Tracking Number:</p>
              <p className="font-medium">{order.trackingNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Status Update:</p>
              <p className="font-medium">{tracking?.message}</p>
            </div>
            <div>
              <p className="text-gray-600">Estimated Delivery:</p>
              <p className="font-medium">{order.estimatedDelivery}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
        <div className="space-y-2">
          <p>{order.shipping.street}</p>
          <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
          <p>{order.shipping.country}</p>
          <p className="mt-4">
            <span className="text-gray-600">Method: </span>
            {order.shipping.shippingMethod}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${order.summary.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>${order.summary.shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span>${order.summary.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4 mt-4">
            <span>Total</span>
            <span>${order.summary.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <a href="/orders" className="text-blue-600 hover:text-blue-800">
          ← Back to Orders
        </a>
      </div>
    </div>
  );
} 