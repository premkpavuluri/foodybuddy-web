import { NextRequest, NextResponse } from 'next/server'
import { Logger } from '@/lib/logger'

// For now, we'll keep the mock data in the BFF layer
// In the future, this can be routed to a dedicated menu service
const mockMenuItems = [
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
