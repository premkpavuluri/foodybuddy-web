// API client for making HTTP requests to the backend
// Currently simulating API calls - will be updated with actual backend integration

import { API_BASE_URL } from '@/constants';
import { ApiResponse, PaginatedResponse, MenuItem, Order, OrderStatus, CartItem, User } from '@/types';

// Mock data for simulation
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 12.99,
    description: 'Classic tomato and mozzarella with fresh basil',
    image: '/images/margherita-pizza.jpg',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    category: 'Pizza',
    price: 14.99,
    description: 'Pepperoni and mozzarella on our signature crust',
    image: '/images/pepperoni-pizza.jpg',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Classic Burger',
    category: 'Burger',
    price: 9.99,
    description: 'Beef patty with lettuce, tomato, and our special sauce',
    image: '/images/classic-burger.jpg',
    isAvailable: true
  },
  {
    id: '4',
    name: 'Pasta Primavera',
    category: 'Pasta',
    price: 11.49,
    description: 'Fresh vegetables with penne in a light cream sauce',
    image: '/images/pasta-primavera.jpg',
    isAvailable: true
  },
  {
    id: '5',
    name: 'Caesar Salad',
    category: 'Salad',
    price: 8.99,
    description: 'Fresh romaine lettuce with caesar dressing and croutons',
    image: '/images/caesar-salad.jpg',
    isAvailable: true
  },
  {
    id: '6',
    name: 'Chocolate Cake',
    category: 'Dessert',
    price: 6.99,
    description: 'Rich chocolate cake with chocolate ganache',
    image: '/images/chocolate-cake.jpg',
    isAvailable: true
  }
];

// Simulate API delay
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generic request function
const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  // Simulate network delay
  await simulateDelay();
  
  try {
    // For now, we'll simulate responses based on endpoint
    // In the future, this will make actual HTTP requests
    console.log(`Simulating API call: ${options.method || 'GET'} ${endpoint}`);
    
    // Return success response (actual implementation will handle real API calls)
    return {
      success: true,
      data: null as T,
      message: 'Simulated response'
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      data: null as T,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Menu API functions
export const menuApi = {
  async getMenuItems(category?: string): Promise<ApiResponse<MenuItem[]>> {
    await simulateDelay();
    
    let filteredItems = mockMenuItems;
    if (category && category !== 'All') {
      filteredItems = mockMenuItems.filter(item => item.category === category);
    }
    
    return {
      success: true,
      data: filteredItems,
      message: 'Menu items retrieved successfully'
    };
  },

  async getMenuItemById(id: string): Promise<ApiResponse<MenuItem | null>> {
    await simulateDelay();
    
    const item = mockMenuItems.find(item => item.id === id);
    
    return {
      success: true,
      data: item || null,
      message: item ? 'Menu item found' : 'Menu item not found'
    };
  },

  async searchMenuItems(query: string): Promise<ApiResponse<MenuItem[]>> {
    await simulateDelay();
    
    const filteredItems = mockMenuItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      success: true,
      data: filteredItems,
      message: 'Search completed successfully'
    };
  }
};

// Order API functions
export const orderApi = {
  async createOrder(items: CartItem[], paymentDetails?: Record<string, unknown>): Promise<ApiResponse<Order>> {
    await simulateDelay();
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Call gateway checkout endpoint
    try {
      const response = await fetch('http://localhost:8080/api/gateway/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            itemId: item.itemId,
            itemName: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: total,
          paymentMethod: paymentDetails?.method || 'CREDIT_CARD',
          cardNumber: paymentDetails?.cardNumber || '',
          cardHolderName: paymentDetails?.cardHolderName || '',
          expiryDate: paymentDetails?.expiryDate || '',
          cvv: paymentDetails?.cvv || '',
          userId: 'user-123' // In real app, get from auth context
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const newOrder: Order = {
          id: result.orderId,
          items,
          total: result.totalAmount,
          status: result.orderStatus as OrderStatus,
          createdAt: result.createdAt,
          updatedAt: result.createdAt
        };
        
        return {
          success: true,
          data: newOrder,
          message: result.message
        };
      } else {
        return {
          success: false,
          data: null,
          message: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create order: ' + (error as Error).message
      };
    }
  },

  async getOrders(): Promise<ApiResponse<Order[]>> {
    await simulateDelay();
    
    try {
      const response = await fetch('http://localhost:8080/api/gateway/orders');
      const result = await response.json();
      
      if (result.orders) {
        return {
          success: true,
          data: result.orders,
          message: 'Orders fetched successfully'
        };
      } else {
        return {
          success: true,
          data: [],
          message: 'No orders found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch orders: ' + (error as Error).message
      };
    }
  },

  async getOrderById(id: string): Promise<ApiResponse<Order | null>> {
    await simulateDelay();
    
    return {
      success: true,
      data: null,
      message: 'Order not found'
    };
  }
};

// User API functions
export const userApi = {
  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    await simulateDelay();
    
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    };
    
    return {
      success: true,
      data: mockUser,
      message: 'User retrieved successfully'
    };
  }
};

// Generic API functions
export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, { method: 'GET' });
  },

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, { method: 'POST' });
  },

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, { method: 'PUT' });
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, { method: 'DELETE' });
  }
};

export default apiClient;
