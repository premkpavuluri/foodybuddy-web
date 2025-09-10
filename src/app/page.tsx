'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Order {
  id: string;
  items: { itemId: string; quantity: number; name: string; price: number }[];
  total: number;
  status: string;
}

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock menu data (in a real app, this would come from the menu service)
  const mockMenuItems: MenuItem[] = [
    { id: '1', name: 'Margherita Pizza', price: 12.99, description: 'Classic tomato and mozzarella' },
    { id: '2', name: 'Pepperoni Pizza', price: 14.99, description: 'Pepperoni and mozzarella' },
    { id: '3', name: 'Caesar Salad', price: 8.99, description: 'Fresh romaine with caesar dressing' },
    { id: '4', name: 'Chicken Wings', price: 10.99, description: 'Spicy buffalo wings' },
  ];

  useEffect(() => {
    // In a real app, this would fetch from the API gateway
    setMenuItems(mockMenuItems);
  }, []);

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(i => i.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const placeOrder = async () => {
    if (Object.keys(cart).length === 0) return;

    setLoading(true);
    try {
      // In a real app, this would call the API gateway
      const orderItems = Object.entries(cart).map(([itemId, quantity]) => {
        const item = menuItems.find(i => i.id === itemId);
        return {
          itemId,
          quantity,
          name: item?.name || '',
          price: item?.price || 0
        };
      });

      const newOrder: Order = {
        id: Date.now().toString(),
        items: orderItems,
        total: getCartTotal(),
        status: 'PENDING'
      };

      setOrders(prev => [newOrder, ...prev]);
      setCart({});
      
      // Simulate payment processing
      setTimeout(() => {
        setOrders(prev => 
          prev.map(order => 
            order.id === newOrder.id 
              ? { ...order, status: 'PAID' }
              : order
          )
        );
      }, 2000);

    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🍕 FoodyBuddy
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Menu Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Menu</h2>
            <div className="space-y-4">
              {menuItems.map(item => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <span className="text-green-600 font-bold">${item.price}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      disabled={!cart[item.id]}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{cart[item.id] || 0}</span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart and Orders Section */}
          <div className="space-y-6">
            {/* Cart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Cart</h2>
              {Object.keys(cart).length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <div>
                  {Object.entries(cart).map(([itemId, quantity]) => {
                    const item = menuItems.find(i => i.id === itemId);
                    return (
                      <div key={itemId} className="flex justify-between items-center py-2">
                        <span>{item?.name} x{quantity}</span>
                        <span>${((item?.price || 0) * quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <button
                      onClick={placeOrder}
                      disabled={loading}
                      className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Order #{order.id}</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          order.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.map((item, index) => (
                          <div key={index}>
                            {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        ))}
                        <div className="font-semibold mt-1">
                          Total: ${order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
