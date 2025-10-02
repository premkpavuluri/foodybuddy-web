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
      <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to emoji if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🍽️</div>';
            }
          }}
        />
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
