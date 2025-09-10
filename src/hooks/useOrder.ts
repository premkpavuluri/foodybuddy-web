'use client';

// Custom hook for order-related state and operations

import { useOrderStore, orderSelectors } from '@/stores';
import { CartItem } from '@/types';

export const useOrder = () => {
  const store = useOrderStore();
  
  // Use selectors for optimized re-renders
  const orders = useOrderStore(orderSelectors.orders);
  const currentOrder = useOrderStore(orderSelectors.currentOrder);
  const orderHistory = useOrderStore(orderSelectors.orderHistory);
  const loading = useOrderStore(orderSelectors.loading);
  const error = useOrderStore(orderSelectors.error);
  const hasOrders = useOrderStore(orderSelectors.hasOrders);

  // Wrapper functions
  const createOrder = async (items: CartItem[], total: number) => {
    return await store.createOrder(items, total);
  };

  const updateOrderStatus = (orderId: string, status: any) => {
    store.updateOrderStatus(orderId, status);
  };

  const fetchOrders = async () => {
    await store.fetchOrders();
  };

  const fetchOrderById = async (orderId: string) => {
    return await store.fetchOrderById(orderId);
  };

  const cancelOrder = async (orderId: string) => {
    return await store.cancelOrder(orderId);
  };

  const getOrderById = (orderId: string) => {
    return store.getOrderById(orderId);
  };

  const clearCurrentOrder = () => {
    store.clearCurrentOrder();
  };

  const getOrdersByStatus = (status: any) => {
    return orders.filter(order => order.status === status);
  };

  const getRecentOrders = (limit: number = 5) => {
    return orders.slice(0, limit);
  };

  return {
    orders,
    currentOrder,
    orderHistory,
    loading,
    error,
    hasOrders,
    createOrder,
    updateOrderStatus,
    fetchOrders,
    fetchOrderById,
    cancelOrder,
    getOrderById,
    clearCurrentOrder,
    getOrdersByStatus,
    getRecentOrders
  };
};
