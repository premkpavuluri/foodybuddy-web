'use client';

// Custom hook for UI-related state and operations

import { useUIStore, uiSelectors, notificationHelpers } from '@/stores';
import { Notification } from '@/types/store';

export const useUI = () => {
  const store = useUIStore();
  
  // Use selectors for optimized re-renders
  const notifications = useUIStore(uiSelectors.notifications);
  const modals = useUIStore(uiSelectors.modals);
  const loading = useUIStore(uiSelectors.loading);
  const theme = useUIStore(uiSelectors.theme);
  const hasNotifications = useUIStore(uiSelectors.hasNotifications);
  const isAnyModalOpen = useUIStore(uiSelectors.isAnyModalOpen);
  const isAnyLoading = useUIStore(uiSelectors.isAnyLoading);

  // Wrapper functions
  const showNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    store.showNotification(notification);
  };

  const hideNotification = (id: string) => {
    store.hideNotification(id);
  };

  const clearNotifications = () => {
    store.clearNotifications();
  };

  const openModal = (modal: keyof typeof modals) => {
    store.openModal(modal);
  };

  const closeModal = (modal: keyof typeof modals) => {
    store.closeModal(modal);
  };

  const closeAllModals = () => {
    store.closeAllModals();
  };

  const setLoading = (key: keyof typeof loading, loadingState: boolean) => {
    store.setLoading(key, loadingState);
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    store.setTheme(theme);
  };

  const isModalOpen = (modal: keyof typeof modals) => {
    return store.modals[modal];
  };

  const isLoading = (key: keyof typeof loading) => {
    return store.loading[key];
  };

  const getNotificationById = (id: string) => {
    return store.notifications.find(notification => notification.id === id);
  };

  return {
    notifications,
    modals,
    loading,
    theme,
    hasNotifications,
    isAnyModalOpen,
    isAnyLoading,
    showNotification,
    hideNotification,
    clearNotifications,
    openModal,
    closeModal,
    closeAllModals,
    setLoading,
    setTheme,
    isModalOpen,
    isLoading,
    getNotificationById,
    // Notification helpers
    notification: notificationHelpers
  };
};
