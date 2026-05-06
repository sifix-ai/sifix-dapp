// GET /api/v1/stats - Platform statistics

import { NextRequest, NextResponse } from 'next/server';
import { StatsService } from '@/services/stats-service';
import { apiResponse, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const stats = await StatsService.getStats();
    return apiResponse(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return apiError('Internal server error', 500);
  }
}
