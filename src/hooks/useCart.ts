// Custom hook for cart state management

import { useState, useCallback } from 'react';
import { CartItem, MenuItem } from '@/types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((menuItem: MenuItem, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.itemId === menuItem.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.itemId === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newCartItem: CartItem = {
          itemId: menuItem.id,
          quantity,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image
        };
        return [...prevItems, newCartItem];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.itemId === itemId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const getItemQuantity = useCallback((itemId: string) => {
    const item = cartItems.find(item => item.itemId === itemId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getItemQuantity
  };
};
