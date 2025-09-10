// Menu items grid component

import React from 'react';
import { MenuItem } from '@/types';
import MenuItemCard from './MenuItemCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface MenuGridProps {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
}

const MenuGrid: React.FC<MenuGridProps> = ({ items, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No items found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MenuGrid;
