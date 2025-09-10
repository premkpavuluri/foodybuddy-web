'use client';

// Custom hook for user-related state and operations

import { useUserStore, userSelectors } from '@/stores';
import { User } from '@/types';
import { UserPreferences } from '@/types/store';

export const useUser = () => {
  const store = useUserStore();
  
  // Use selectors for optimized re-renders
  const user = useUserStore(userSelectors.user);
  const isAuthenticated = useUserStore(userSelectors.isAuthenticated);
  const loading = useUserStore(userSelectors.loading);
  const error = useUserStore(userSelectors.error);
  const preferences = useUserStore(userSelectors.preferences);
  const userName = useUserStore(userSelectors.userName);
  const userEmail = useUserStore(userSelectors.userEmail);
  const userPhone = useUserStore(userSelectors.userPhone);
  const userAddress = useUserStore(userSelectors.userAddress);
  const hasAddress = useUserStore(userSelectors.hasAddress);
  const isGuest = useUserStore(userSelectors.isGuest);

  // Wrapper functions
  const login = async (email: string, password: string) => {
    return await store.login(email, password);
  };

  const logout = () => {
    store.logout();
  };

  const register = async (userData: Partial<User>) => {
    return await store.register(userData);
  };

  const updateProfile = async (userData: Partial<User>) => {
    return await store.updateProfile(userData);
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    store.updatePreferences(preferences);
  };

  const fetchUser = async () => {
    await store.fetchUser();
  };

  const clearError = () => {
    store.clearError();
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    preferences,
    userName,
    userEmail,
    userPhone,
    userAddress,
    hasAddress,
    isGuest,
    login,
    logout,
    register,
    updateProfile,
    updatePreferences,
    fetchUser,
    clearError
  };
};
