'use client';

// Cart page component

import React from 'react';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

const CartPage: React.FC = () => {
  const { cartItems, getCartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
        
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6 text-center">
            Looks like you haven't added any delicious items to your cart yet
          </p>
          <Link href="/menu">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              Browse Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.itemId} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Food';
                    }}
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.itemId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.itemId} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
