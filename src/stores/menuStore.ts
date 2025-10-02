'use client';

// Menu store implementation using Zustand

import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MenuStore } from '@/types/store';
import { MenuItem } from '@/types';
import { menuApi } from '@/lib/api/client';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useMenuStore = create<MenuStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      items: [],
      categories: ['All', 'Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Beverages'],
      selectedCategory: 'All',
      searchQuery: '',
      filteredItems: [],
      loading: false,
      error: null,
      lastFetched: null,

      // Actions
      fetchMenuItems: async (category?: string) => {
        const state = get();
        const targetCategory = category || state.selectedCategory;
        
        // Check if we have cached data that's still fresh
        if (state.lastFetched && Date.now() - state.lastFetched < CACHE_DURATION && state.items.length > 0) {
          // Apply category filter to cached data
          const filteredItems = targetCategory === 'All' 
            ? state.items 
            : state.items.filter(item => item.category === targetCategory);
          
          set({
            filteredItems,
            selectedCategory: targetCategory,
            searchQuery: '',
            error: null
          }, false, 'menu/fetchMenuItems-cached');
          return;
        }

        set({ loading: true, error: null }, false, 'menu/fetchMenuItems-start');

        try {
          const response = await menuApi.getMenuItems(targetCategory);
          
          if (response.success && response.data) {
            const filteredItems = targetCategory === 'All' 
              ? response.data 
              : response.data.filter(item => item.category === targetCategory);

            set({
              items: response.data,
              filteredItems,
              selectedCategory: targetCategory,
              searchQuery: '',
              loading: false,
              error: null,
              lastFetched: Date.now()
            }, false, 'menu/fetchMenuItems-success');
          } else {
            set({
              loading: false,
              error: response.error || 'Failed to fetch menu items'
            }, false, 'menu/fetchMenuItems-error');
          }
        } catch (error) {
          console.error('Error fetching menu items:', error);
          set({
            loading: false,
            error: 'An unexpected error occurred while fetching menu items'
          }, false, 'menu/fetchMenuItems-error');
        }
      },

      searchItems: async (query: string) => {
        set({ 
          searchQuery: query,
          loading: true, 
          error: null 
        }, false, 'menu/searchItems-start');

        try {
          if (!query.trim()) {
            // If search is empty, show all items for current category
            const state = get();
            const filteredItems = state.selectedCategory === 'All' 
              ? state.items 
              : state.items.filter(item => item.category === state.selectedCategory);
            
            set({
              filteredItems,
              loading: false,
              error: null
            }, false, 'menu/searchItems-clear');
            return;
          }

          const response = await menuApi.searchMenuItems(query);
          
          if (response.success && response.data) {
            set({
              filteredItems: response.data,
              loading: false,
              error: null
            }, false, 'menu/searchItems-success');
          } else {
            set({
              loading: false,
              error: response.error || 'Search failed'
            }, false, 'menu/searchItems-error');
          }
        } catch (error) {
          console.error('Error searching menu items:', error);
          set({
            loading: false,
            error: 'An unexpected error occurred during search'
          }, false, 'menu/searchItems-error');
        }
      },

      setCategory: (category: string) => {
        set((state) => {
          const filteredItems = category === 'All' 
            ? state.items 
            : state.items.filter(item => item.category === category);

          return {
            selectedCategory: category,
            filteredItems,
            searchQuery: '' // Clear search when changing category
          };
        }, false, 'menu/setCategory');
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query }, false, 'menu/setSearchQuery');
      },

      clearSearch: () => {
        set((state) => {
          const filteredItems = state.selectedCategory === 'All' 
            ? state.items 
            : state.items.filter(item => item.category === state.selectedCategory);

          return {
            searchQuery: '',
            filteredItems
          };
        }, false, 'menu/clearSearch');
      },

      refreshMenu: async () => {
        const state = get();
        set({ lastFetched: null }, false, 'menu/refreshMenu');
        await state.fetchMenuItems();
      },

      getItemById: (id: string) => {
        const state = get();
        return state.items.find(item => item.id === id) || null;
      },

      getItemsByCategory: (category: string) => {
        const state = get();
        return category === 'All' 
          ? state.items 
          : state.items.filter(item => item.category === category);
      }
    }),
    {
      name: 'menu-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Selectors for optimized re-renders
export const menuSelectors = {
  items: (state: MenuStore) => state.items,
  filteredItems: (state: MenuStore) => state.filteredItems,
  categories: (state: MenuStore) => state.categories,
  selectedCategory: (state: MenuStore) => state.selectedCategory,
  searchQuery: (state: MenuStore) => state.searchQuery,
  loading: (state: MenuStore) => state.loading,
  error: (state: MenuStore) => state.error,
  isEmpty: (state: MenuStore) => state.filteredItems.length === 0,
  isSearching: (state: MenuStore) => state.searchQuery.length > 0,
  getItemById: (state: MenuStore) => (id: string) => state.getItemById(id),
  getItemsByCategory: (state: MenuStore) => (category: string) => state.getItemsByCategory(category)
};

// Utility functions
export const menuUtils = {
  formatPrice: (price: number) => `$${price.toFixed(2)}`,
  getCategoryIcon: (category: string) => {
    const icons: Record<string, string> = {
      'Pizza': '🍕',
      'Burger': '🍔',
      'Pasta': '🍝',
      'Salad': '🥗',
      'Dessert': '🍰',
      'Beverages': '🥤',
      'All': '🍽️'
    };
    return icons[category] || '🍽️';
  },
  isItemAvailable: (item: MenuItem) => item.isAvailable,
  getItemImage: (item: MenuItem) => item.image || '/images/placeholder-food.jpg'
};

// Hydration check hook
export const useMenuHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};
