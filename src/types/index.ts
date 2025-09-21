// Core types for the Foody Buddy application

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
}

export interface CartItem {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  DIGITAL_WALLET = 'DIGITAL_WALLET'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Gateway Response Types
export interface GatewayOrder {
  orderId: string;
  paymentId: string;
  transactionId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GatewayOrdersResponse {
  orders: GatewayOrder[];
  count: number;
}

export interface GatewayCheckoutResponse {
  success: boolean;
  message: string;
  orderId: string;
  paymentId: string;
  transactionId: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
}

export interface GatewayOrderDetailsResponse {
  orderId: string;
  paymentId: string;
  transactionId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// BFF Response Types
export interface BFFOrdersResponse {
  success: boolean;
  data: GatewayOrder[];
  message: string;
}

export interface BFFOrderDetailsResponse {
  success: boolean;
  data: GatewayOrderDetailsResponse;
  message: string;
}

export interface BFFCheckoutResponse {
  success: boolean;
  data: GatewayCheckoutResponse;
  message: string;
}
