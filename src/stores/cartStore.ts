'use client';

// Cart store implementation using Zustand

import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { CartStore } from '@/types/store';
import { MenuItem, CartItem } from '@/types';

// Cart store with persistence and devtools
export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        items: [],
        total: 0,
        itemCount: 0,
        isOpen: false,

        // Actions
        addItem: (menuItem: MenuItem, quantity: number = 1) => {
          set((state) => {
            const existingItem = state.items.find(item => item.itemId === menuItem.id);
            
            let newItems: CartItem[];
            
            if (existingItem) {
              // Update existing item quantity
              newItems = state.items.map(item =>
                item.itemId === menuItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              );
            } else {
              // Add new item
              const newCartItem: CartItem = {
                itemId: menuItem.id,
                quantity,
                name: menuItem.name,
                price: menuItem.price,
                image: menuItem.image
              };
              newItems = [...state.items, newCartItem];
            }

            const newTotal = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            const newItemCount = newItems.reduce((count, item) => count + item.quantity, 0);

            return {
              items: newItems,
              total: newTotal,
              itemCount: newItemCount
            };
          }, false, 'cart/addItem');
        },

        removeItem: (itemId: string) => {
          set((state) => {
            const newItems = state.items.filter(item => item.itemId !== itemId);
            const newTotal = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            const newItemCount = newItems.reduce((count, item) => count + item.quantity, 0);

            return {
              items: newItems,
              total: newTotal,
              itemCount: newItemCount
            };
          }, false, 'cart/removeItem');
        },

        updateQuantity: (itemId: string, quantity: number) => {
          set((state) => {
            if (quantity <= 0) {
              // Remove item if quantity is 0 or negative
              const newItems = state.items.filter(item => item.itemId !== itemId);
              const newTotal = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
              const newItemCount = newItems.reduce((count, item) => count + item.quantity, 0);

              return {
                items: newItems,
                total: newTotal,
                itemCount: newItemCount
              };
            }

            // Update quantity
            const newItems = state.items.map(item =>
              item.itemId === itemId
                ? { ...item, quantity }
                : item
            );
            const newTotal = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            const newItemCount = newItems.reduce((count, item) => count + item.quantity, 0);

            return {
              items: newItems,
              total: newTotal,
              itemCount: newItemCount
            };
          }, false, 'cart/updateQuantity');
        },

        clearCart: () => {
          set({
            items: [],
            total: 0,
            itemCount: 0
          }, false, 'cart/clearCart');
        },

        toggleCart: () => {
          set((state) => ({
            isOpen: !state.isOpen
          }), false, 'cart/toggleCart');
        },

        openCart: () => {
          set({ isOpen: true }, false, 'cart/openCart');
        },

        closeCart: () => {
          set({ isOpen: false }, false, 'cart/closeCart');
        },

        getItemQuantity: (itemId: string) => {
          const state = get();
          const item = state.items.find(item => item.itemId === itemId);
          return item ? item.quantity : 0;
        },

        calculateTotal: () => {
          set((state) => {
            const newTotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            const newItemCount = state.items.reduce((count, item) => count + item.quantity, 0);

            return {
              total: newTotal,
              itemCount: newItemCount
            };
          }, false, 'cart/calculateTotal');
        }
      }),
      {
        name: 'foodybuddy-cart',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          items: state.items,
          total: state.total,
          itemCount: state.itemCount
        }),
        version: 1,
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            // Handle migration from version 0 to 1
            return {
              ...persistedState,
              isOpen: false
            };
          }
          return persistedState;
        }
      }
    ),
    {
      name: 'cart-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Selectors for optimized re-renders
export const cartSelectors = {
  items: (state: CartStore) => state.items,
  total: (state: CartStore) => state.total,
  itemCount: (state: CartStore) => state.itemCount,
  isOpen: (state: CartStore) => state.isOpen,
  isEmpty: (state: CartStore) => state.items.length === 0,
  getItemQuantity: (state: CartStore) => (itemId: string) => state.getItemQuantity(itemId)
};

// Utility functions
export const cartUtils = {
  formatPrice: (price: number) => `$${price.toFixed(2)}`,
  calculateItemTotal: (price: number, quantity: number) => price * quantity,
  validateQuantity: (quantity: number) => Math.max(0, Math.floor(quantity))
};

// Hydration check hook
export const useCartHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};
