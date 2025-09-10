'use client';

// Custom hook for menu-related state and operations - now using Zustand store

import { useEffect } from 'react';
import { useMenuStore, menuSelectors, useMenuHydration } from '@/stores';

export const useMenu = (category?: string) => {
  const store = useMenuStore();
  const isHydrated = useMenuHydration();
  
  // Use selectors for optimized re-renders
  const menuItems = useMenuStore(menuSelectors.items);
  const filteredItems = useMenuStore(menuSelectors.filteredItems);
  const categories = useMenuStore(menuSelectors.categories);
  const selectedCategory = useMenuStore(menuSelectors.selectedCategory);
  const searchQuery = useMenuStore(menuSelectors.searchQuery);
  const loading = useMenuStore(menuSelectors.loading);
  const error = useMenuStore(menuSelectors.error);
  const isEmpty = useMenuStore(menuSelectors.isEmpty);
  const isSearching = useMenuStore(menuSelectors.isSearching);

  // Wrapper functions for backward compatibility
  const fetchMenuItems = async (selectedCategory?: string) => {
    await store.fetchMenuItems(selectedCategory || category);
  };

  const searchMenuItems = async (query: string) => {
    await store.searchItems(query);
  };

  const setCategory = (category: string) => {
    store.setCategory(category);
  };

  const setSearchQuery = (query: string) => {
    store.setSearchQuery(query);
  };

  const clearSearch = () => {
    store.clearSearch();
  };

  const refreshMenu = async () => {
    await store.refreshMenu();
  };

  const getItemById = (id: string) => {
    return store.getItemById(id);
  };

  const getItemsByCategory = (category: string) => {
    return store.getItemsByCategory(category);
  };

  // Auto-fetch menu items when category changes
  useEffect(() => {
    if (category && category !== selectedCategory) {
      setCategory(category);
    }
    fetchMenuItems();
  }, [category]);

  return {
    menuItems: isHydrated ? filteredItems : [], // Return filtered items for display
    allMenuItems: isHydrated ? menuItems : [], // Return all items for reference
    categories: isHydrated ? categories : ['All'],
    selectedCategory: isHydrated ? selectedCategory : 'All',
    searchQuery: isHydrated ? searchQuery : '',
    loading: isHydrated ? loading : true,
    error: isHydrated ? error : null,
    isEmpty: isHydrated ? isEmpty : true,
    isSearching: isHydrated ? isSearching : false,
    isHydrated,
    fetchMenuItems,
    searchMenuItems,
    setCategory,
    setSearchQuery,
    clearSearch,
    refreshMenu,
    getItemById,
    getItemsByCategory
  };
};
