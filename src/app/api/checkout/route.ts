import { NextRequest, NextResponse } from 'next/server'
import { Logger } from '@/lib/logger'
import { GatewayCheckoutResponse, BFFCheckoutResponse } from '@/types'

const GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    
    Logger.info('BFF: Processing checkout request', {
      timestamp: new Date().toISOString(),
      itemCount: body.items?.length || 0,
      totalAmount: body.totalAmount
    })

    // Forward request to gateway service
    const response = await fetch(`${GATEWAY_BASE_URL}/api/gateway/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward any authorization headers if present
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      },
      body: JSON.stringify(body)
    })

    const data: GatewayCheckoutResponse = await response.json()
    const responseTime = Date.now() - startTime

    if (!response.ok) {
      Logger.error('BFF: Checkout failed from gateway', {
        status: response.status,
        error: data.message || 'Unknown error',
        responseTime: `${responseTime}ms`
      })
      
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Checkout failed',
          error: data.error || 'Unknown error'
        },
        { status: response.status }
      )
    }

    Logger.info('BFF: Checkout successful', {
      orderId: data.orderId,
      responseTime: `${responseTime}ms`
    })

    // Wrap gateway response in BFF format while preserving original field names
    const bffResponse: BFFCheckoutResponse = {
      success: data.success,
      data: data,
      message: data.message
    }

    return NextResponse.json(bffResponse)
  } catch (error) {
    const responseTime = Date.now() - startTime
    Logger.error('BFF: Error processing checkout', {
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
