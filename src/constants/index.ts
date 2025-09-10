// Application constants

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const ROUTES = {
  HOME: '/',
  MENU: '/menu',
  CART: '/cart',
  ORDERS: '/orders',
  PROFILE: '/profile',
  SETTINGS: '/settings'
} as const;

export const MENU_CATEGORIES = [
  'All',
  'Pizza',
  'Burger',
  'Pasta',
  'Salad',
  'Dessert',
  'Beverages'
] as const;

export const FEATURE_CARDS = [
  {
    id: 'premium-quality',
    icon: '⭐',
    title: 'Premium Quality',
    description: 'Fresh ingredients, expertly prepared'
  },
  {
    id: 'fast-delivery',
    icon: '⏰',
    title: 'Fast Delivery',
    description: 'Hot meals delivered in 30 minutes'
  },
  {
    id: 'free-delivery',
    icon: '🚚',
    title: 'Free Delivery',
    description: 'On orders over $25'
  }
] as const;

export const NAVIGATION_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
    path: ROUTES.HOME
  },
  {
    id: 'menu',
    label: 'Menu',
    icon: '✨',
    path: ROUTES.MENU
  },
  {
    id: 'cart',
    label: 'Cart',
    icon: '🛒',
    path: ROUTES.CART
  }
] as const;

export const ACCOUNT_ITEMS = [
  {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    path: ROUTES.PROFILE
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: '🕐',
    path: ROUTES.ORDERS
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    path: ROUTES.SETTINGS
  }
] as const;
