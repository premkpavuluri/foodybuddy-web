// Store middleware for logging, error handling, and devtools

import { StoreMiddleware } from '@/types/store';

// Logging middleware
export const createLoggingMiddleware = (): StoreMiddleware => ({
  onStateChange: (state, prevState) => {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔄 Store State Changed');
      console.log('Previous State:', prevState);
      console.log('Current State:', state);
      console.groupEnd();
    }
  },
  
  onAction: (action, args, state) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🎯 Action: ${action}`);
      console.log('Arguments:', args);
      console.log('State After:', state);
      console.groupEnd();
    }
  },
  
  onError: (error, action, args) => {
    console.error(`❌ Store Error in action "${action}":`, error);
    console.error('Action arguments:', args);
    
    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, { action, args });
    }
  }
});

// Performance monitoring middleware
export const createPerformanceMiddleware = (): StoreMiddleware => ({
  onAction: (action, args, state) => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      
      // Monitor action execution time
      setTimeout(() => {
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        if (executionTime > 100) { // Log slow actions (>100ms)
          console.warn(`⚠️ Slow action detected: ${action} took ${executionTime.toFixed(2)}ms`);
        }
      }, 0);
    }
  }
});

// Error boundary middleware
export const createErrorBoundaryMiddleware = (): StoreMiddleware => ({
  onError: (error, action, args) => {
    // Create a user-friendly error message
    const userFriendlyMessage = getErrorMessage(error, action);
    
    // You could dispatch a notification here
    // useUIStore.getState().showNotification({
    //   type: 'error',
    //   title: 'Something went wrong',
    //   message: userFriendlyMessage
    // });
    
    console.error('Store Error:', {
      action,
      args,
      error: error.message,
      stack: error.stack
    });
  }
});

// Helper function to create user-friendly error messages
const getErrorMessage = (error: Error, action: string): string => {
  const errorMessages: Record<string, string> = {
    'cart/addItem': 'Failed to add item to cart. Please try again.',
    'cart/removeItem': 'Failed to remove item from cart. Please try again.',
    'menu/fetchMenuItems': 'Failed to load menu items. Please refresh the page.',
    'menu/searchItems': 'Search failed. Please try again.',
    'order/createOrder': 'Failed to create order. Please try again.',
    'order/fetchOrders': 'Failed to load orders. Please try again.',
    'user/login': 'Login failed. Please check your credentials.',
    'user/register': 'Registration failed. Please try again.',
    'user/updateProfile': 'Failed to update profile. Please try again.'
  };
  
  return errorMessages[action] || 'An unexpected error occurred. Please try again.';
};

// Persistence middleware
export const createPersistenceMiddleware = (storeName: string) => ({
  onStateChange: (state: any) => {
    // This is handled by Zustand's persist middleware
    // But we can add additional logic here if needed
    if (process.env.NODE_ENV === 'development') {
      console.log(`💾 ${storeName} state persisted to localStorage`);
    }
  }
});

// Analytics middleware (for tracking user actions)
export const createAnalyticsMiddleware = (): StoreMiddleware => ({
  onAction: (action, args, state) => {
    // Track important user actions
    const trackableActions = [
      'cart/addItem',
      'cart/removeItem',
      'cart/clearCart',
      'order/createOrder',
      'user/login',
      'user/register'
    ];
    
    if (trackableActions.includes(action)) {
      // In a real app, you would send this to your analytics service
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Analytics: ${action}`, { args, timestamp: Date.now() });
      }
      
      // Example: Send to analytics service
      // analyticsService.track(action, { args, timestamp: Date.now() });
    }
  }
});

// Combine all middleware
export const createStoreMiddleware = (storeName: string): StoreMiddleware => {
  const loggingMiddleware = createLoggingMiddleware();
  const performanceMiddleware = createPerformanceMiddleware();
  const errorBoundaryMiddleware = createErrorBoundaryMiddleware();
  const persistenceMiddleware = createPersistenceMiddleware(storeName);
  const analyticsMiddleware = createAnalyticsMiddleware();
  
  return {
    onStateChange: (state, prevState) => {
      loggingMiddleware.onStateChange?.(state, prevState);
      persistenceMiddleware.onStateChange?.(state);
    },
    
    onAction: (action, args, state) => {
      loggingMiddleware.onAction?.(action, args, state);
      performanceMiddleware.onAction?.(action, args, state);
      analyticsMiddleware.onAction?.(action, args, state);
    },
    
    onError: (error, action, args) => {
      loggingMiddleware.onError?.(error, action, args);
      errorBoundaryMiddleware.onError?.(error, action, args);
    }
  };
};

// Store configuration
export const storeConfig = {
  enableDevtools: process.env.NODE_ENV === 'development',
  enablePersistence: true,
  enableLogging: process.env.NODE_ENV === 'development',
  enableAnalytics: process.env.NODE_ENV === 'production',
  persistenceOptions: {
    cart: {
      name: 'foodybuddy-cart',
      storage: 'localStorage' as const,
      whitelist: ['items', 'total', 'itemCount'],
      version: 1
    },
    user: {
      name: 'foodybuddy-user',
      storage: 'localStorage' as const,
      whitelist: ['user', 'isAuthenticated', 'preferences'],
      version: 1
    },
    ui: {
      name: 'foodybuddy-ui',
      storage: 'localStorage' as const,
      whitelist: ['theme'],
      version: 1
    }
  }
};
