'use client';

// UI store implementation using Zustand

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { UIStore, Notification, ModalState, GlobalLoadingState } from '@/types/store';

// Default modal state
const defaultModalState: ModalState = {
  cart: false,
  orderConfirmation: false,
  userProfile: false,
  orderDetails: false
};

// Default loading state
const defaultLoadingState: GlobalLoadingState = {
  menu: false,
  cart: false,
  orders: false,
  user: false,
  payment: false
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        notifications: [],
        modals: defaultModalState,
        loading: defaultLoadingState,
        theme: 'system',

        // Actions
        showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
          const newNotification: Notification = {
            ...notification,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
          };

          set((state) => ({
            notifications: [...state.notifications, newNotification]
          }), false, 'ui/showNotification');

          // Auto-remove notification after duration (default 5 seconds)
          const duration = notification.duration || 5000;
          if (duration > 0) {
            setTimeout(() => {
              get().hideNotification(newNotification.id);
            }, duration);
          }
        },

        hideNotification: (id: string) => {
          set((state) => ({
            notifications: state.notifications.filter(notification => notification.id !== id)
          }), false, 'ui/hideNotification');
        },

        clearNotifications: () => {
          set({ notifications: [] }, false, 'ui/clearNotifications');
        },

        openModal: (modal: keyof ModalState) => {
          set((state) => ({
            modals: { ...state.modals, [modal]: true }
          }), false, 'ui/openModal');
        },

        closeModal: (modal: keyof ModalState) => {
          set((state) => ({
            modals: { ...state.modals, [modal]: false }
          }), false, 'ui/closeModal');
        },

        closeAllModals: () => {
          set({ modals: defaultModalState }, false, 'ui/closeAllModals');
        },

        setLoading: (key: keyof GlobalLoadingState, loading: boolean) => {
          set((state) => ({
            loading: { ...state.loading, [key]: loading }
          }), false, 'ui/setLoading');
        },

        setTheme: (theme: 'light' | 'dark' | 'system') => {
          set({ theme }, false, 'ui/setTheme');
          
          // Apply theme to document
          if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            
            if (theme === 'system') {
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              root.classList.add(systemTheme);
            } else {
              root.classList.add(theme);
            }
          }
        }
      }),
      {
        name: 'foodybuddy-ui',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          theme: state.theme
        }),
        version: 1
      }
    ),
    {
      name: 'ui-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Selectors for optimized re-renders
export const uiSelectors = {
  notifications: (state: UIStore) => state.notifications,
  modals: (state: UIStore) => state.modals,
  loading: (state: UIStore) => state.loading,
  theme: (state: UIStore) => state.theme,
  hasNotifications: (state: UIStore) => state.notifications.length > 0,
  isModalOpen: (state: UIStore) => (modal: keyof ModalState) => state.modals[modal],
  isAnyModalOpen: (state: UIStore) => Object.values(state.modals).some(open => open),
  isLoading: (state: UIStore) => (key: keyof GlobalLoadingState) => state.loading[key],
  isAnyLoading: (state: UIStore) => Object.values(state.loading).some(loading => loading),
  getNotificationById: (state: UIStore) => (id: string) => 
    state.notifications.find(notification => notification.id === id)
};

// Utility functions
export const uiUtils = {
  getNotificationIcon: (type: Notification['type']) => {
    const icons: Record<Notification['type'], string> = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  },
  getNotificationColor: (type: Notification['type']) => {
    const colors: Record<Notification['type'], string> = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    return colors[type] || 'bg-gray-50 border-gray-200 text-gray-800';
  },
  formatNotificationTime: (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  },
  getThemeIcon: (theme: 'light' | 'dark' | 'system') => {
    const icons: Record<'light' | 'dark' | 'system', string> = {
      light: '☀️',
      dark: '🌙',
      system: '🖥️'
    };
    return icons[theme] || '🖥️';
  },
  getThemeLabel: (theme: 'light' | 'dark' | 'system') => {
    const labels: Record<'light' | 'dark' | 'system', string> = {
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    };
    return labels[theme] || 'System';
  }
};

// Notification helper functions
export const notificationHelpers = {
  success: (title: string, message: string, duration?: number) => {
    useUIStore.getState().showNotification({
      type: 'success',
      title,
      message,
      duration
    });
  },
  error: (title: string, message: string, duration?: number) => {
    useUIStore.getState().showNotification({
      type: 'error',
      title,
      message,
      duration
    });
  },
  warning: (title: string, message: string, duration?: number) => {
    useUIStore.getState().showNotification({
      type: 'warning',
      title,
      message,
      duration
    });
  },
  info: (title: string, message: string, duration?: number) => {
    useUIStore.getState().showNotification({
      type: 'info',
      title,
      message,
      duration
    });
  }
};
