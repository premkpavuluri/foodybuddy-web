// Custom hook for menu-related state and operations

import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@/types';
import { menuApi } from '@/lib/api/client';

export const useMenu = (category?: string) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = useCallback(async (selectedCategory?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await menuApi.getMenuItems(selectedCategory || category);
      
      if (response.success && response.data) {
        setMenuItems(response.data);
      } else {
        setError(response.error || 'Failed to fetch menu items');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const searchMenuItems = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchMenuItems();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await menuApi.searchMenuItems(query);
      
      if (response.success && response.data) {
        setMenuItems(response.data);
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      setError('An unexpected error occurred during search');
      console.error('Error searching menu items:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchMenuItems]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    searchMenuItems
  };
};
