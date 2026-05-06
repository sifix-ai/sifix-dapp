// GET /api/v1/stats - Platform statistics

import { NextRequest, NextResponse } from 'next/server';
import { StatsService } from '@/services/stats-service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const stats = await StatsService.getStats();
    return apiSuccess(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return apiError('Internal server error', '500');
  }
}
