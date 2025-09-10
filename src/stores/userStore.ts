'use client';

// User store implementation using Zustand

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { UserStore, UserPreferences } from '@/types/store';
import { User } from '@/types';
import { userApi } from '@/lib/api/client';

// Default user preferences
const defaultPreferences: UserPreferences = {
  theme: 'system',
  notifications: true,
  language: 'en',
  currency: 'USD'
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        preferences: defaultPreferences,

        // Actions
        login: async (email: string, password: string) => {
          set({ loading: true, error: null }, false, 'user/login-start');

          try {
            // In a real app, this would make an API call to authenticate
            // For now, we'll simulate a successful login
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            
            // Mock user data - in real app, this would come from API response
            const mockUser: User = {
              id: '1',
              name: 'John Doe',
              email: email,
              phone: '+1234567890',
              address: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA'
              }
            };

            set({
              user: mockUser,
              isAuthenticated: true,
              loading: false,
              error: null
            }, false, 'user/login-success');

            return true;
          } catch (error) {
            console.error('Login error:', error);
            set({
              loading: false,
              error: 'Login failed. Please check your credentials.'
            }, false, 'user/login-error');
            return false;
          }
        },

        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
            error: null
          }, false, 'user/logout');
        },

        register: async (userData: Partial<User>) => {
          set({ loading: true, error: null }, false, 'user/register-start');

          try {
            // In a real app, this would make an API call to register
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            
            // Mock user creation - in real app, this would come from API response
            const newUser: User = {
              id: Date.now().toString(),
              name: userData.name || 'New User',
              email: userData.email || '',
              phone: userData.phone,
              address: userData.address
            };

            set({
              user: newUser,
              isAuthenticated: true,
              loading: false,
              error: null
            }, false, 'user/register-success');

            return true;
          } catch (error) {
            console.error('Registration error:', error);
            set({
              loading: false,
              error: 'Registration failed. Please try again.'
            }, false, 'user/register-error');
            return false;
          }
        },

        updateProfile: async (userData: Partial<User>) => {
          set({ loading: true, error: null }, false, 'user/updateProfile-start');

          try {
            const state = get();
            if (!state.user) {
              set({
                loading: false,
                error: 'No user logged in'
              }, false, 'user/updateProfile-error');
              return false;
            }

            // In a real app, this would make an API call to update profile
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
            
            const updatedUser: User = {
              ...state.user,
              ...userData
            };

            set({
              user: updatedUser,
              loading: false,
              error: null
            }, false, 'user/updateProfile-success');

            return true;
          } catch (error) {
            console.error('Profile update error:', error);
            set({
              loading: false,
              error: 'Failed to update profile. Please try again.'
            }, false, 'user/updateProfile-error');
            return false;
          }
        },

        updatePreferences: (preferences: Partial<UserPreferences>) => {
          set((state) => ({
            preferences: { ...state.preferences, ...preferences }
          }), false, 'user/updatePreferences');
        },

        fetchUser: async () => {
          set({ loading: true, error: null }, false, 'user/fetchUser-start');

          try {
            const response = await userApi.getCurrentUser();
            
            if (response.success && response.data) {
              set({
                user: response.data,
                isAuthenticated: true,
                loading: false,
                error: null
              }, false, 'user/fetchUser-success');
            } else {
              set({
                user: null,
                isAuthenticated: false,
                loading: false,
                error: response.error || 'Failed to fetch user data'
              }, false, 'user/fetchUser-error');
            }
          } catch (error) {
            console.error('Error fetching user:', error);
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: 'An unexpected error occurred while fetching user data'
            }, false, 'user/fetchUser-error');
          }
        },

        clearError: () => {
          set({ error: null }, false, 'user/clearError');
        }
      }),
      {
        name: 'foodybuddy-user',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          preferences: state.preferences
        }),
        version: 1,
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            // Handle migration from version 0 to 1
            return {
              ...persistedState,
              preferences: { ...defaultPreferences, ...persistedState.preferences }
            };
          }
          return persistedState;
        }
      }
    ),
    {
      name: 'user-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Selectors for optimized re-renders
export const userSelectors = {
  user: (state: UserStore) => state.user,
  isAuthenticated: (state: UserStore) => state.isAuthenticated,
  loading: (state: UserStore) => state.loading,
  error: (state: UserStore) => state.error,
  preferences: (state: UserStore) => state.preferences,
  userName: (state: UserStore) => state.user?.name || 'Guest',
  userEmail: (state: UserStore) => state.user?.email || '',
  userPhone: (state: UserStore) => state.user?.phone || '',
  userAddress: (state: UserStore) => state.user?.address || null,
  hasAddress: (state: UserStore) => !!state.user?.address,
  isGuest: (state: UserStore) => !state.isAuthenticated
};

// Utility functions
export const userUtils = {
  formatUserName: (user: User | null) => user?.name || 'Guest',
  formatUserEmail: (user: User | null) => user?.email || '',
  formatUserPhone: (user: User | null) => user?.phone || 'Not provided',
  formatAddress: (address: User['address']) => {
    if (!address) return 'No address provided';
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  },
  validateEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  validatePhone: (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },
  getInitials: (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }
};
