'use client';

// Custom hook for cart state management - now using Zustand store

import { useCartStore, cartSelectors, useCartHydration } from '@/stores';
import { MenuItem } from '@/types';

export const useCart = () => {
  const store = useCartStore();
  const isHydrated = useCartHydration();
  
  // Use selectors for optimized re-renders
  const cartItems = useCartStore(cartSelectors.items);
  const total = useCartStore(cartSelectors.total);
  const itemCount = useCartStore(cartSelectors.itemCount);
  const isOpen = useCartStore(cartSelectors.isOpen);
  const isEmpty = useCartStore(cartSelectors.isEmpty);

  // Wrapper functions for backward compatibility
  const addToCart = (menuItem: MenuItem, quantity: number = 1) => {
    store.addItem(menuItem, quantity);
  };

  const removeFromCart = (itemId: string) => {
    store.removeItem(itemId);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    store.updateQuantity(itemId, quantity);
  };

  const clearCart = () => {
    store.clearCart();
  };

  const getCartTotal = () => {
    return store.total;
  };

  const getCartItemCount = () => {
    return store.itemCount;
  };

  const getItemQuantity = (itemId: string) => {
    return store.getItemQuantity(itemId);
  };

  const toggleCart = () => {
    store.toggleCart();
  };

  const openCart = () => {
    store.openCart();
  };

  const closeCart = () => {
    store.closeCart();
  };

  return {
    cartItems: isHydrated ? cartItems : [],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getItemQuantity,
    toggleCart,
    openCart,
    closeCart,
    total: isHydrated ? total : 0,
    itemCount: isHydrated ? itemCount : 0,
    isOpen: isHydrated ? isOpen : false,
    isEmpty: isHydrated ? isEmpty : true,
    isHydrated
  };
};
