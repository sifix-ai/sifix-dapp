// GET /api/v1/leaderboard - Top reporters

import { NextRequest } from 'next/server';
import { StatsService } from '@/services/stats-service';
import { apiSuccess, apiError } from '@/lib/api-response';

/** Maximum number of leaderboard entries a client may request */
const MAX_LEADERBOARD_LIMIT = 100;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawLimit = parseInt(searchParams.get('limit') || '50');
    // Cap limit to prevent abuse
    const limit = Math.min(Math.max(rawLimit, 1), MAX_LEADERBOARD_LIMIT);

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
    return apiError('Internal server error', '500');
  }
}
