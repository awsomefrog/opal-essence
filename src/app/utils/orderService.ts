import { v4 as uuidv4 } from 'uuid';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingDetails {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  shippingMethod: string;
  estimatedDays: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  shipping: ShippingDetails;
  summary: OrderSummary;
  status: OrderStatus;
  trackingNumber: string;
  createdAt: string;
  estimatedDelivery: string;
  paymentStatus: PaymentStatus;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

// Simulated tracking updates
const TRACKING_UPDATES = {
  PENDING: 'Order received, payment pending',
  PROCESSING: 'Order confirmed, preparing for shipment',
  SHIPPED: 'Package in transit from Newberg, OR',
  DELIVERED: 'Package delivered to destination',
  CANCELLED: 'Order cancelled'
};

// In a real app, this would be stored in a database
let orders: Order[] = [];

export async function createOrder(
  items: OrderItem[],
  shipping: ShippingDetails,
  summary: OrderSummary,
  paymentStatus: PaymentStatus
): Promise<Order> {
  const order: Order = {
    id: uuidv4(),
    orderNumber: generateOrderNumber(),
    items,
    shipping,
    summary,
    status: OrderStatus.PENDING,
    trackingNumber: generateTrackingNumber(),
    createdAt: new Date().toISOString(),
    estimatedDelivery: calculateEstimatedDelivery(shipping.estimatedDays),
    paymentStatus
  };

  orders.push(order);
  return order;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  return orders.find(order => order.id === orderId) || null;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  const order = orders.find(order => order.id === orderId);
  if (order) {
    order.status = status;
    return order;
  }
  return null;
}

export async function getOrderTracking(orderId: string): Promise<{
  status: OrderStatus;
  message: string;
  estimatedDelivery: string;
  trackingNumber: string;
} | null> {
  const order = await getOrder(orderId);
  if (!order) return null;

  return {
    status: order.status,
    message: TRACKING_UPDATES[order.status],
    estimatedDelivery: order.estimatedDelivery,
    trackingNumber: order.trackingNumber
  };
}

function generateOrderNumber(): string {
  // Format: EJ-YYYYMMDD-XXXX (EJ for Elegant Jewelry)
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `EJ-${year}${month}${day}-${random}`;
}

function generateTrackingNumber(): string {
  // Format: 1Z999AA10123456784
  const prefix = '1Z999AA';
  const random = Math.floor(Math.random() * 100000000000).toString().padStart(11, '0');
  return `${prefix}${random}`;
}

function calculateEstimatedDelivery(estimatedDays: string): string {
  const [minDays, maxDays] = estimatedDays.split('-').map(Number);
  const date = new Date();
  date.setDate(date.getDate() + (maxDays || minDays));
  return date.toISOString().split('T')[0];
} 