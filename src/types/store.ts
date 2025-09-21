// Store types and interfaces for Zustand state management

import { MenuItem, CartItem, Order, User, OrderStatus, PaymentStatus, GatewayOrder } from './index';

// ==================== CART STORE TYPES ====================

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

export interface CartActions {
  addItem: (menuItem: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (itemId: string) => number;
  calculateTotal: () => void;
}

export type CartStore = CartState & CartActions;

// ==================== MENU STORE TYPES ====================

export interface MenuState {
  items: MenuItem[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  filteredItems: MenuItem[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

export interface MenuActions {
  fetchMenuItems: (category?: string) => Promise<void>;
  searchItems: (query: string) => Promise<void>;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  refreshMenu: () => Promise<void>;
  getItemById: (id: string) => MenuItem | null;
  getItemsByCategory: (category: string) => MenuItem[];
}

export type MenuStore = MenuState & MenuActions;

// ==================== ORDER STORE TYPES ====================

export interface OrderState {
  orders: GatewayOrder[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  orderHistory: GatewayOrder[];
}

export interface OrderActions {
  createOrder: (items: CartItem[], total: number) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  getOrderById: (orderId: string) => Order | null;
  clearCurrentOrder: () => void;
}

export type OrderStore = OrderState & OrderActions;

// ==================== USER STORE TYPES ====================

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  currency: string;
}

export interface UserActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export type UserStore = UserState & UserActions;

// ==================== UI STORE TYPES ====================

export interface UIState {
  notifications: Notification[];
  modals: ModalState;
  loading: GlobalLoadingState;
  theme: 'light' | 'dark' | 'system';
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

export interface ModalState {
  cart: boolean;
  orderConfirmation: boolean;
  userProfile: boolean;
  orderDetails: boolean;
  [key: string]: boolean;
}

export interface GlobalLoadingState {
  menu: boolean;
  cart: boolean;
  orders: boolean;
  user: boolean;
  payment: boolean;
}

export interface UIActions {
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  hideNotification: (id: string) => void;
  clearNotifications: () => void;
  openModal: (modal: keyof ModalState) => void;
  closeModal: (modal: keyof ModalState) => void;
  closeAllModals: () => void;
  setLoading: (key: keyof GlobalLoadingState, loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export type UIStore = UIState & UIActions;

// ==================== STORE MIDDLEWARE TYPES ====================

export interface StoreMiddleware {
  onStateChange?: (state: any, prevState: any) => void;
  onAction?: (action: string, args: any[], state: any) => void;
  onError?: (error: Error, action: string, args: any[]) => void;
}

// ==================== PERSISTENCE TYPES ====================

export interface PersistOptions {
  name: string;
  storage?: 'localStorage' | 'sessionStorage';
  whitelist?: string[];
  blacklist?: string[];
  version?: number;
  migrate?: (persistedState: any, version: number) => any;
}

// ==================== API RESPONSE TYPES ====================

export interface StoreApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  loading: boolean;
}

// ==================== STORE CONFIGURATION ====================

export interface StoreConfig {
  enableDevtools: boolean;
  enablePersistence: boolean;
  enableLogging: boolean;
  persistenceOptions: {
    cart: PersistOptions;
    user: PersistOptions;
    ui: PersistOptions;
  };
}

// ==================== UTILITY TYPES ====================

export type StoreSelector<T, U> = (state: T) => U;
export type StoreSubscriber<T> = (state: T, prevState: T) => void;
export type StoreUnsubscriber = () => void;

// ==================== STORE PROVIDER TYPES ====================

export interface StoreProviderProps {
  children: React.ReactNode;
  config?: Partial<StoreConfig>;
}

export interface StoreContextValue {
  cart: CartStore;
  menu: MenuStore;
  order: OrderStore;
  user: UserStore;
  ui: UIStore;
}
