'use client';

// Featured items section for the home page

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useMenu } from '@/hooks/useMenu';
import { useCart } from '@/hooks/useCart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const FeaturedItems: React.FC = () => {
  const { menuItems, loading } = useMenu();
  const { addToCart, getItemQuantity } = useCart();

  // Get first 3 items as featured items
  const featuredItems = menuItems.slice(0, 3);

  const handleAddToCart = (item: any) => {
    addToCart(item, 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Featured Items</h2>
        <Button variant="outline">
          View All Menu →
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredItems.map((item) => (
          <Card key={item.id} hover className="overflow-hidden">
            <div className="aspect-w-16 aspect-h-12 mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  // Fallback image if the original fails to load
                  e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Food+Image';
                }}
              />
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{item.category}</p>
              <p className="text-2xl font-bold text-orange-500">
                ${item.price.toFixed(2)}
              </p>
            </div>

            <Button
              onClick={() => handleAddToCart(item)}
              className="w-full"
              disabled={!item.isAvailable}
            >
              {getItemQuantity(item.id) > 0 ? `Add More (${getItemQuantity(item.id)})` : 'Add to Cart'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedItems;
