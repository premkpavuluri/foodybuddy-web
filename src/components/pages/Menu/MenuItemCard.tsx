'use client';

// Menu item card component

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MenuItem } from '@/types';
import { useCart } from '@/hooks/useCart';

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addToCart, getItemQuantity } = useCart();

  const handleAddToCart = () => {
    addToCart(item, 1);
  };

  return (
    <Card hover className="overflow-hidden">
      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
        <div className="text-gray-400 text-4xl">🍽️</div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        <p className="text-2xl font-bold text-orange-500">
          ${item.price.toFixed(2)}
        </p>
      </div>

      <Button
        onClick={handleAddToCart}
        className="w-full"
        disabled={!item.isAvailable}
      >
        {getItemQuantity(item.id) > 0 ? `Add More (${getItemQuantity(item.id)})` : 'Add to Cart'}
      </Button>
    </Card>
  );
};

export default MenuItemCard;
