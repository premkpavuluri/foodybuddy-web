'use client';

// Order store implementation using Zustand

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { OrderStore } from '@/types/store';
import { Order, OrderStatus, CartItem, GatewayOrder } from '@/types';
import { orderApi } from '@/lib/api/client';

export const useOrderStore = create<OrderStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      orders: [],
      currentOrder: null,
      loading: false,
      error: null,
      orderHistory: [],

      // Actions
      createOrder: async (items: CartItem[], total: number, paymentDetails?: Record<string, unknown>) => {
        set({ loading: true, error: null }, false, 'order/createOrder-start');

        try {
          const response = await orderApi.createOrder(items, paymentDetails);
          
          if (response.success && response.data) {
            const newOrder = response.data;
            
            set((state) => ({
              orders: [newOrder, ...state.orders],
              currentOrder: newOrder,
              orderHistory: [newOrder, ...state.orderHistory],
              loading: false,
              error: null
            }), false, 'order/createOrder-success');

            return newOrder;
          } else {
            set({
              loading: false,
              error: response.error || 'Failed to create order'
            }, false, 'order/createOrder-error');
            return null;
          }
        } catch (error) {
          console.error('Error creating order:', error);
          set({
            loading: false,
            error: 'An unexpected error occurred while creating order'
          }, false, 'order/createOrder-error');
          return null;
        }
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        set((state) => {
          const updatedOrders = state.orders.map(order =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          );

          const updatedOrderHistory = state.orderHistory.map(order =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          );

          const updatedCurrentOrder = state.currentOrder?.id === orderId
            ? { ...state.currentOrder, status, updatedAt: new Date().toISOString() }
            : state.currentOrder;

          return {
            orders: updatedOrders,
            orderHistory: updatedOrderHistory,
            currentOrder: updatedCurrentOrder
          };
        }, false, 'order/updateOrderStatus');
      },

      fetchOrders: async () => {
        set({ loading: true, error: null }, false, 'order/fetchOrders-start');

        try {
          const response = await orderApi.getOrders();
          
          if (response.success && response.data) {
            set({
              orders: response.data,
              orderHistory: response.data,
              loading: false,
              error: null
            }, false, 'order/fetchOrders-success');
          } else {
            set({
              loading: false,
              error: response.error || 'Failed to fetch orders'
            }, false, 'order/fetchOrders-error');
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          set({
            loading: false,
            error: 'An unexpected error occurred while fetching orders'
          }, false, 'order/fetchOrders-error');
        }
      },

      fetchOrderById: async (orderId: string) => {
        set({ loading: true, error: null }, false, 'order/fetchOrderById-start');

        try {
          const response = await orderApi.getOrderById(orderId);
          
          if (response.success && response.data) {
            set((state) => {
              const existingOrderIndex = state.orders.findIndex(order => order.id === orderId);
              const updatedOrders = existingOrderIndex >= 0
                ? state.orders.map(order => order.id === orderId ? response.data! : order)
                : [response.data!, ...state.orders];

              return {
                orders: updatedOrders,
                currentOrder: response.data,
                loading: false,
                error: null
              };
            }, false, 'order/fetchOrderById-success');

            return response.data;
          } else {
            set({
              loading: false,
              error: response.error || 'Order not found'
            }, false, 'order/fetchOrderById-error');
            return null;
          }
        } catch (error) {
          console.error('Error fetching order:', error);
          set({
            loading: false,
            error: 'An unexpected error occurred while fetching order'
          }, false, 'order/fetchOrderById-error');
          return null;
        }
      },

      cancelOrder: async (orderId: string) => {
        set({ loading: true, error: null }, false, 'order/cancelOrder-start');

        try {
          // In a real app, this would make an API call to cancel the order
          // For now, we'll just update the local state
          const state = get();
          const order = state.orders.find(o => o.id === orderId);
          
          if (!order) {
            set({
              loading: false,
              error: 'Order not found'
            }, false, 'order/cancelOrder-error');
            return false;
          }

          if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
            set({
              loading: false,
              error: 'Cannot cancel this order'
            }, false, 'order/cancelOrder-error');
            return false;
          }

          // Update order status to cancelled
          state.updateOrderStatus(orderId, OrderStatus.CANCELLED);
          
          set({
            loading: false,
            error: null
          }, false, 'order/cancelOrder-success');

          return true;
        } catch (error) {
          console.error('Error cancelling order:', error);
          set({
            loading: false,
            error: 'An unexpected error occurred while cancelling order'
          }, false, 'order/cancelOrder-error');
          return false;
        }
      },

      getOrderById: (orderId: string) => {
        const state = get();
        return state.orders.find(order => order.id === orderId) || null;
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null }, false, 'order/clearCurrentOrder');
      }
    }),
    {
      name: 'order-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Selectors for optimized re-renders
export const orderSelectors = {
  orders: (state: OrderStore) => state.orders,
  currentOrder: (state: OrderStore) => state.currentOrder,
  orderHistory: (state: OrderStore) => state.orderHistory,
  loading: (state: OrderStore) => state.loading,
  error: (state: OrderStore) => state.error,
  hasOrders: (state: OrderStore) => state.orders.length > 0,
  getOrderById: (state: OrderStore) => (orderId: string) => state.getOrderById(orderId),
  getOrdersByStatus: (state: OrderStore) => (status: OrderStatus) => 
    state.orders.filter(order => order.status === status),
  getRecentOrders: (state: OrderStore) => (limit: number = 5) => 
    state.orders.slice(0, limit)
};

// Utility functions
export const orderUtils = {
  formatOrderId: (id: string) => `#${id.slice(-6).toUpperCase()}`,
  formatOrderDate: (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  getOrderStatusColor: (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'text-yellow-600 bg-yellow-100',
      [OrderStatus.CONFIRMED]: 'text-blue-600 bg-blue-100',
      [OrderStatus.PREPARING]: 'text-orange-600 bg-orange-100',
      [OrderStatus.READY]: 'text-green-600 bg-green-100',
      [OrderStatus.DELIVERED]: 'text-emerald-800 bg-emerald-200',
      [OrderStatus.CANCELLED]: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  },
  getOrderStatusText: (status: OrderStatus) => {
    const texts: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Pending',
      [OrderStatus.CONFIRMED]: 'Confirmed',
      [OrderStatus.PREPARING]: 'Preparing',
      [OrderStatus.READY]: 'Ready for Pickup',
      [OrderStatus.DELIVERED]: 'Delivered',
      [OrderStatus.CANCELLED]: 'Cancelled'
    };
    return texts[status] || 'Unknown';
  },
  canCancelOrder: (order: Order) => {
    return order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED;
  },
  calculateOrderTotal: (items: CartItem[]) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
};
