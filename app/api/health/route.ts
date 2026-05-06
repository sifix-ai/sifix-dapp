// Health check endpoint

import { NextRequest } from 'next/server';
import { apiResponse, apiError } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    return apiResponse({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return apiError('Service unhealthy', 503);
  }
}
