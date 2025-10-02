import { NextRequest, NextResponse } from 'next/server'
import { Logger } from '@/lib/logger'

// For now, we'll keep the mock data in the BFF layer
// In the future, this can be routed to a dedicated menu service
const mockMenuItems = [
  // Pizza Category
  {
    id: '1',
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 12.99,
    description: 'Classic tomato and mozzarella with fresh basil',
    image: '/assets/menu-items/margherita-pizza.jpg',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    category: 'Pizza',
    price: 14.99,
    description: 'Pepperoni and mozzarella on our signature crust',
    image: '/assets/menu-items/pepperoni-pizza.jpg',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Veggie Supreme Pizza',
    category: 'Pizza',
    price: 15.99,
    description: 'Loaded with fresh vegetables, mushrooms, and bell peppers',
    image: '/assets/menu-items/veggie-pizza.jpg',
    isAvailable: true
  },
  // Burger Category
  {
    id: '4',
    name: 'Classic Burger',
    category: 'Burger',
    price: 9.99,
    description: 'Beef patty with lettuce, tomato, and our special sauce',
    image: '/assets/menu-items/classic-burger.jpg',
    isAvailable: true
  },
  {
    id: '5',
    name: 'Bacon Cheeseburger',
    category: 'Burger',
    price: 12.99,
    description: 'Double beef patty with crispy bacon and melted cheese',
    image: '/assets/menu-items/bacon-cheeseburger.jpg',
    isAvailable: true
  },
  {
    id: '6',
    name: 'Veggie Burger',
    category: 'Burger',
    price: 10.99,
    description: 'Plant-based patty with fresh vegetables and avocado',
    image: '/assets/menu-items/veggie-burger.jpg',
    isAvailable: true
  },
  // Pasta Category
  {
    id: '7',
    name: 'Pasta Primavera',
    category: 'Pasta',
    price: 11.49,
    description: 'Fresh vegetables with penne in a light cream sauce',
    image: '/assets/menu-items/pasta-primavera.jpg',
    isAvailable: true
  },
  {
    id: '8',
    name: 'Spaghetti & Meatballs',
    category: 'Pasta',
    price: 13.99,
    description: 'Classic spaghetti with homemade meatballs in marinara sauce',
    image: '/assets/menu-items/spaghetti-meatballs.jpg',
    isAvailable: true
  },
  {
    id: '9',
    name: 'Fettuccine Alfredo',
    category: 'Pasta',
    price: 12.49,
    description: 'Creamy alfredo sauce with fresh fettuccine pasta',
    image: '/assets/menu-items/fettuccine-alfredo.jpg',
    isAvailable: true
  },
  // Salad Category
  {
    id: '10',
    name: 'Caesar Salad',
    category: 'Salad',
    price: 8.99,
    description: 'Fresh romaine lettuce with caesar dressing and croutons',
    image: '/assets/menu-items/caesar-salad.jpg',
    isAvailable: true
  },
  {
    id: '11',
    name: 'Strawberry Spinach Salad',
    category: 'Salad',
    price: 10.99,
    description: 'Fresh spinach with strawberries, walnuts, and feta cheese',
    image: '/assets/menu-items/strawberry-spinach-salad.jpg',
    isAvailable: true
  },
  {
    id: '12',
    name: 'Greek Salad',
    category: 'Salad',
    price: 9.99,
    description: 'Mixed greens with olives, tomatoes, cucumber, and feta',
    image: '/assets/menu-items/greek-salad.jpg',
    isAvailable: true
  },
  // Dessert Category
  {
    id: '13',
    name: 'Chocolate Cake',
    category: 'Dessert',
    price: 6.99,
    description: 'Rich chocolate cake with chocolate ganache',
    image: '/assets/menu-items/chocolate-cake.jpg',
    isAvailable: true
  },
  {
    id: '14',
    name: 'Strawberry Cheesecake',
    category: 'Dessert',
    price: 7.99,
    description: 'Creamy cheesecake topped with fresh strawberries',
    image: '/assets/menu-items/strawberry-cheesecake.jpg',
    isAvailable: true
  },
  {
    id: '15',
    name: 'Tiramisu',
    category: 'Dessert',
    price: 8.49,
    description: 'Classic Italian dessert with coffee-soaked ladyfingers',
    image: '/assets/menu-items/tiramisu.jpg',
    isAvailable: true
  },
  // Beverages Category
  {
    id: '16',
    name: 'Coca Cola',
    category: 'Beverages',
    price: 2.99,
    description: 'Classic refreshing cola with ice',
    image: '/assets/menu-items/coca-cola.jpg',
    isAvailable: true
  },
  {
    id: '17',
    name: 'Fresh Orange Juice',
    category: 'Beverages',
    price: 4.99,
    description: 'Freshly squeezed orange juice with pulp',
    image: '/assets/menu-items/orange-juice.jpg',
    isAvailable: true
  },
  {
    id: '18',
    name: 'Coffee',
    category: 'Beverages',
    price: 3.49,
    description: 'Freshly brewed coffee with rich aroma',
    image: '/assets/menu-items/coffee.jpg',
    isAvailable: true
  },
  {
    id: '19',
    name: 'Sparkling Water',
    category: 'Beverages',
    price: 2.49,
    description: 'Refreshing sparkling water with lemon and mint',
    image: '/assets/menu-items/sparkling-water.jpg',
    isAvailable: true
  }
]

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    Logger.info('BFF: Fetching menu items', {
      timestamp: new Date().toISOString(),
      category,
      search,
      url: request.url
    })

    let filteredItems = mockMenuItems

    // Filter by category
    if (category && category !== 'All') {
      filteredItems = filteredItems.filter(item => item.category === category)
    }

    // Filter by search query
    if (search) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    const responseTime = Date.now() - startTime

    Logger.info('BFF: Successfully fetched menu items', {
      itemCount: filteredItems.length,
      responseTime: `${responseTime}ms`
    })

    return NextResponse.json({
      success: true,
      data: filteredItems,
      message: 'Menu items retrieved successfully'
    })
  } catch (error) {
    const responseTime = Date.now() - startTime
    Logger.error('BFF: Error fetching menu items', {
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${responseTime}ms`
    })
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
