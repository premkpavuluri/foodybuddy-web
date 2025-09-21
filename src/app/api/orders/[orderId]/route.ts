import { NextRequest, NextResponse } from 'next/server'
import { Logger } from '@/lib/logger'
import { GatewayOrderDetailsResponse, BFFOrderDetailsResponse } from '@/types'

const GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || 'http://localhost:8080'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const startTime = Date.now()
  const { orderId } = params
  
  try {
    Logger.info('BFF: Fetching order details', {
      orderId,
      timestamp: new Date().toISOString(),
      url: request.url
    })

    // Forward request to gateway service
    const response = await fetch(`${GATEWAY_BASE_URL}/api/gateway/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward any authorization headers if present
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      }
    })

    const data: GatewayOrderDetailsResponse = await response.json()
    const responseTime = Date.now() - startTime

    if (!response.ok) {
      Logger.error('BFF: Failed to fetch order details from gateway', {
        orderId,
        status: response.status,
        error: 'Unknown error',
        responseTime: `${responseTime}ms`
      })
      
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch order details',
          error: 'Unknown error'
        },
        { status: response.status }
      )
    }

    Logger.info('BFF: Successfully fetched order details', {
      orderId,
      responseTime: `${responseTime}ms`
    })

    // Wrap gateway response in BFF format while preserving original field names
    const bffResponse: BFFOrderDetailsResponse = {
      success: true,
      data: data,
      message: 'Order details fetched successfully'
    }

    return NextResponse.json(bffResponse)
  } catch (error) {
    const responseTime = Date.now() - startTime
    Logger.error('BFF: Error fetching order details', {
      orderId,
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
