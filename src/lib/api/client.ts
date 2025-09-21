// API client for making HTTP requests to the backend
// Uses BFF (Backend for Frontend) pattern - calls internal API routes

import { 
  ApiResponse, 
  PaginatedResponse, 
  MenuItem, 
  Order, 
  OrderStatus, 
  CartItem, 
  User,
  BFFOrdersResponse,
  BFFOrderDetailsResponse,
  BFFCheckoutResponse,
  GatewayOrder,
  GatewayCheckoutResponse,
  GatewayOrderDetailsResponse
} from '@/types';

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

// Generic request function for BFF API routes
const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    console.log(`BFF API call: ${options.method || 'GET'} ${endpoint}`);
    
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null as T,
        error: data.message || data.error || 'Request failed',
        message: data.message || 'Request failed'
      };
    }

    return {
      success: data.success !== false,
      data: data.data || data,
      message: data.message || 'Request successful'
    };
  } catch (error) {
    console.error('BFF API request failed:', error);
    return {
      success: false,
      data: null as T,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Menu API functions - now using BFF API routes
export const menuApi = {
  async getMenuItems(category?: string): Promise<ApiResponse<MenuItem[]>> {
    const params = new URLSearchParams();
    if (category && category !== 'All') {
      params.append('category', category);
    }
    
    const endpoint = `/api/menu${params.toString() ? `?${params.toString()}` : ''}`;
    return makeRequest<MenuItem[]>(endpoint);
  },

  async getMenuItemById(id: string): Promise<ApiResponse<MenuItem | null>> {
    return makeRequest<MenuItem | null>(`/api/menu/${id}`);
  },

  async searchMenuItems(query: string): Promise<ApiResponse<MenuItem[]>> {
    const params = new URLSearchParams();
    params.append('search', query);
    
    return makeRequest<MenuItem[]>(`/api/menu?${params.toString()}`);
  }
};

// Order API functions - now using BFF API routes
export const orderApi = {
  async createOrder(items: CartItem[], paymentDetails?: Record<string, unknown>): Promise<ApiResponse<Order>> {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const requestBody = {
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
    };

    const response = await makeRequest<BFFCheckoutResponse>('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    // Transform gateway response to Order format
    if (response.success && response.data) {
      const orderData = response.data as unknown as GatewayCheckoutResponse;
      const newOrder: Order = {
        id: orderData.orderId,
        items,
        total: orderData.totalAmount,
        status: orderData.orderStatus as OrderStatus,
        createdAt: orderData.createdAt,
        updatedAt: orderData.createdAt // Gateway doesn't provide updatedAt
      };
      
      return {
        success: true,
        data: newOrder,
        message: response.message
      };
    }

    return {
      success: false,
      data: null as any,
      message: response.message || 'Checkout failed'
    };
  },

  async getOrders(): Promise<ApiResponse<GatewayOrder[]>> {
    const response = await makeRequest<BFFOrdersResponse>('/api/orders');
    
    if (response.success) {
      return {
        success: true,
        data: response.data as unknown as GatewayOrder[],
        message: response.message
      };
    }
    
    return {
      success: false,
      data: [],
      message: response.message || 'Failed to fetch orders'
    };
  },

  async getOrderById(id: string): Promise<ApiResponse<GatewayOrder | null>> {
    const response = await makeRequest<BFFOrderDetailsResponse>(`/api/orders/${id}`);
    
    if (response.success) {
      return {
        success: true,
        data: response.data as unknown as GatewayOrder,
        message: response.message
      };
    }
    
    return {
      success: false,
      data: null,
      message: response.message || 'Failed to fetch order details'
    };
  }
};

// User API functions - using mock data for now
export const userApi = {
  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    // For now, return mock user data
    // In the future, this can be routed to a user service via BFF
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
