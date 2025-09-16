import { NextResponse } from 'next/server'
import { Logger } from '@/lib/logger'

export async function GET() {
  const startTime = Date.now()
  
  try {
    Logger.info('Health check endpoint accessed', {
      timestamp: new Date().toISOString(),
      userAgent: 'Docker Health Check'
    })

    // Basic health check - you can add more sophisticated checks here
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    }

    const responseTime = Date.now() - startTime
    Logger.info('Health check successful', {
      ...healthData,
      responseTime: `${responseTime}ms`
    })

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    const responseTime = Date.now() - startTime
    Logger.error('Health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
