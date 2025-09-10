# Foody Buddy Store Architecture

This document describes the robust state management system implemented using Zustand for the Foody Buddy application.

## Overview

The store system is built with the following principles:
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Performance**: Optimized re-renders using selectors
- **Persistence**: Automatic data persistence for cart and user data
- **Developer Experience**: DevTools integration and comprehensive logging
- **Scalability**: Modular architecture that can grow with the application

## Store Structure

### 1. Cart Store (`cartStore.ts`)
Manages shopping cart state and operations.

**State:**
- `items`: Array of cart items
- `total`: Total cart value
- `itemCount`: Total number of items
- `isOpen`: Cart modal visibility

**Key Actions:**
- `addItem(menuItem, quantity)`: Add item to cart
- `removeItem(itemId)`: Remove item from cart
- `updateQuantity(itemId, quantity)`: Update item quantity
- `clearCart()`: Empty the cart
- `toggleCart()`: Toggle cart visibility

**Persistence:** ✅ (localStorage)

### 2. Menu Store (`menuStore.ts`)
Manages menu items, categories, and search functionality.

**State:**
- `items`: All menu items
- `filteredItems`: Currently displayed items
- `categories`: Available categories
- `selectedCategory`: Currently selected category
- `searchQuery`: Current search query
- `loading`: Loading state
- `error`: Error state

**Key Actions:**
- `fetchMenuItems(category)`: Fetch menu items
- `searchItems(query)`: Search menu items
- `setCategory(category)`: Set selected category
- `clearSearch()`: Clear search query

**Caching:** ✅ (5-minute cache duration)

### 3. Order Store (`orderStore.ts`)
Manages order history and order operations.

**State:**
- `orders`: All orders
- `currentOrder`: Currently active order
- `orderHistory`: Order history
- `loading`: Loading state
- `error`: Error state

**Key Actions:**
- `createOrder(items, total)`: Create new order
- `updateOrderStatus(orderId, status)`: Update order status
- `fetchOrders()`: Fetch all orders
- `cancelOrder(orderId)`: Cancel an order

### 4. User Store (`userStore.ts`)
Manages user authentication and profile data.

**State:**
- `user`: Current user data
- `isAuthenticated`: Authentication status
- `preferences`: User preferences
- `loading`: Loading state
- `error`: Error state

**Key Actions:**
- `login(email, password)`: User login
- `logout()`: User logout
- `register(userData)`: User registration
- `updateProfile(userData)`: Update user profile
- `updatePreferences(preferences)`: Update user preferences

**Persistence:** ✅ (localStorage)

### 5. UI Store (`uiStore.ts`)
Manages global UI state and notifications.

**State:**
- `notifications`: Array of notifications
- `modals`: Modal visibility states
- `loading`: Global loading states
- `theme`: Current theme

**Key Actions:**
- `showNotification(notification)`: Show notification
- `openModal(modal)`: Open modal
- `setTheme(theme)`: Set theme
- `setLoading(key, loading)`: Set loading state

**Persistence:** ✅ (theme only)

## Usage Examples

### Basic Store Usage

```typescript
import { useCartStore, useMenuStore } from '@/stores';

function CartComponent() {
  // Direct store access
  const cartItems = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  
  return (
    <div>
      {cartItems.map(item => (
        <div key={item.itemId}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Using Hooks (Recommended)

```typescript
import { useCart, useMenu, useUser } from '@/hooks';

function MenuComponent() {
  const { menuItems, loading, addToCart } = useMenu();
  const { addItem } = useCart();
  
  const handleAddToCart = (item) => {
    addItem(item, 1);
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {menuItems.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <button onClick={() => handleAddToCart(item)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Using Selectors for Performance

```typescript
import { useCartStore, cartSelectors } from '@/stores';

function CartSummary() {
  // Only re-renders when total changes
  const total = useCartStore(cartSelectors.total);
  const itemCount = useCartStore(cartSelectors.itemCount);
  
  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}
```

### Using Store Context

```typescript
import { useStore } from '@/stores';

function SomeComponent() {
  const { cart, menu, user, ui } = useStore();
  
  // Access all stores through context
  const cartItems = cart.items;
  const menuItems = menu.items;
  const currentUser = user.user;
}
```

## Advanced Features

### Persistence
Cart and user data are automatically persisted to localStorage and restored on app reload.

### Caching
Menu items are cached for 5 minutes to improve performance and reduce API calls.

### Error Handling
Comprehensive error handling with user-friendly error messages and automatic error recovery.

### DevTools Integration
Full Redux DevTools integration for debugging in development mode.

### Notifications
Built-in notification system with automatic dismissal and customizable duration.

### Theme Management
System theme detection with manual override options.

## Best Practices

1. **Use Hooks**: Prefer the custom hooks over direct store access for better encapsulation
2. **Use Selectors**: Use selectors to prevent unnecessary re-renders
3. **Error Handling**: Always handle loading and error states in your components
4. **Type Safety**: Leverage TypeScript for better development experience
5. **Performance**: Use selectors and avoid subscribing to entire store state

## Migration Guide

The new store system is backward compatible with existing hooks. No changes are required to existing components, but you can gradually migrate to use the new features.

### Before (Old Hook)
```typescript
const { cartItems, addToCart } = useCart();
```

### After (New Hook - Same API)
```typescript
const { cartItems, addToCart } = useCart(); // Same API, better performance
```

### New Features Available
```typescript
const { cartItems, addToCart, total, itemCount, isOpen, toggleCart } = useCart();
```

## Troubleshooting

### Common Issues

1. **Store not updating**: Make sure you're using the correct selector
2. **Persistence not working**: Check if localStorage is available
3. **Type errors**: Ensure you're importing types from the correct location
4. **Performance issues**: Use selectors instead of subscribing to entire state

### Debug Mode

Enable debug mode by setting `NODE_ENV=development` to see detailed logging and DevTools integration.

## Future Enhancements

- [ ] Real-time updates with WebSocket integration
- [ ] Offline support with service workers
- [ ] Advanced caching strategies
- [ ] State synchronization across tabs
- [ ] Advanced analytics integration
