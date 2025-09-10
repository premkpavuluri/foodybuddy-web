'use client';

// Central store exports and provider

import React, { createContext, useContext, ReactNode } from 'react';
import { useCartStore } from './cartStore';
import { useMenuStore } from './menuStore';
import { useOrderStore } from './orderStore';
import { useUserStore } from './userStore';
import { useUIStore } from './uiStore';
import { StoreContextValue } from '@/types/store';

// Store context
const StoreContext = createContext<StoreContextValue | null>(null);

// Store provider component
interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const cart = useCartStore();
  const menu = useMenuStore();
  const order = useOrderStore();
  const user = useUserStore();
  const ui = useUIStore();

  const value: StoreContextValue = {
    cart,
    menu,
    order,
    user,
    ui
  };

  return React.createElement(
    StoreContext.Provider,
    { value },
    children
  );
};

// Hook to use store context
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

// Individual store hooks (for direct access)
export {
  useCartStore,
  useMenuStore,
  useOrderStore,
  useUserStore,
  useUIStore
};

// Store selectors exports
export { cartSelectors } from './cartStore';
export { menuSelectors } from './menuStore';
export { orderSelectors } from './orderStore';
export { userSelectors } from './userStore';
export { uiSelectors } from './uiStore';

// Store utilities exports
export { cartUtils, useCartHydration } from './cartStore';
export { menuUtils, useMenuHydration } from './menuStore';
export { orderUtils } from './orderStore';
export { userUtils } from './userStore';
export { uiUtils, notificationHelpers } from './uiStore';

// Store types
export type { StoreContextValue } from '@/types/store';
