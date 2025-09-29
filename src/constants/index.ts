// Application constants

// Note: API_BASE_URL removed - now using BFF pattern with relative API routes

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
    icon: 'home',
    path: ROUTES.HOME
  },
  {
    id: 'menu',
    label: 'Menu',
    icon: 'menu',
    path: ROUTES.MENU
  },
  {
    id: 'cart',
    label: 'Cart',
    icon: 'cart',
    path: ROUTES.CART
  }
] as const;

export const ACCOUNT_ITEMS = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'profile',
    path: ROUTES.PROFILE
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: 'orders',
    path: ROUTES.ORDERS
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: ROUTES.SETTINGS
  }
] as const;
