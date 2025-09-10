'use client';

import { useEffect, useState } from 'react';
import { StoreProvider } from '@/stores';

interface ClientStoreProviderProps {
  children: React.ReactNode;
}

export default function ClientStoreProvider({ children }: ClientStoreProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side before rendering stores
    setIsHydrated(true);
  }, []);

  // Don't render stores until after hydration
  if (!isHydrated) {
    return <>{children}</>;
  }

  return <StoreProvider>{children}</StoreProvider>;
}
