'use client';

// Featured items section for the home page

import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useMenu } from '@/hooks/useMenu';
import { useCart } from '@/hooks/useCart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const FeaturedItems: React.FC = () => {
  const { menuItems, loading } = useMenu();
  const { addToCart, getItemQuantity } = useCart();

  // Get featured items with variety from different categories
  const getFeaturedItems = () => {
    if (menuItems.length === 0) return [];
    
    const featuredItems = [];
    const categories = ['Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Beverages'];
    
    // Try to get one item from each category for variety
    for (const category of categories) {
      const categoryItem = menuItems.find(item => item.category === category);
      if (categoryItem && featuredItems.length < 3) {
        featuredItems.push(categoryItem);
      }
    }
    
    // If we still need more items, fill with remaining items
    while (featuredItems.length < 3 && featuredItems.length < menuItems.length) {
      const remainingItems = menuItems.filter(item => !featuredItems.includes(item));
      if (remainingItems.length > 0) {
        featuredItems.push(remainingItems[0]);
      } else {
        break;
      }
    }
    
    return featuredItems;
  };

  const featuredItems = getFeaturedItems();

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
        <Link href="/menu">
          <Button variant="outline">
            View All Menu →
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredItems.map((item) => (
          <Card key={item.id} hover className="overflow-hidden h-full flex flex-col">
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4 flex-shrink-0">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-5xl bg-gray-50">🍽️</div>';
                  }
                }}
              />
            </div>
            
            <div className="flex-grow flex flex-col justify-between p-1">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm text-orange-600 font-medium mb-2 uppercase tracking-wide">
                  {item.category}
                </p>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <p className="text-2xl font-bold text-orange-500">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <Button
                onClick={() => handleAddToCart(item)}
                className="w-full mt-auto"
                disabled={!item.isAvailable}
              >
                {getItemQuantity(item.id) > 0 ? `Add More (${getItemQuantity(item.id)})` : 'Add to Cart'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedItems;
