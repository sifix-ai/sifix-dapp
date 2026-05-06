// GET /api/v1/leaderboard - Top reporters

import { NextRequest, NextResponse } from 'next/server';
import { StatsService } from '@/services/stats-service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const leaderboard = await StatsService.getLeaderboard(limit);

    return apiSuccess({
      leaderboard: leaderboard.map((entry) => ({
        address: entry.address.address,
        overallScore: entry.overallScore,
        reporterScore: entry.reporterScore,
        accuracyScore: entry.accuracyScore,
        reportsSubmitted: entry.reportsSubmitted,
        reportsVerified: entry.reportsVerified,
      })),
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return apiError('Internal server error', 500);
  }
}
