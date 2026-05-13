// GET /api/v1/stats - Platform statistics

import { NextRequest, NextResponse } from 'next/server';
import { StatsService } from '@/services/stats-service';
import { AccuracyService } from '@/services/accuracy-service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const [stats, accuracy] = await Promise.all([
      StatsService.getStats(),
      AccuracyService.getStats(),
    ]);

    return apiSuccess({
      ...stats,
      accuracy: {
        totalPredictions: accuracy.totalPredictions,
        resolvedPredictions: accuracy.resolvedPredictions,
        correctPredictions: accuracy.correctPredictions,
        accuracy: accuracy.accuracy,
        rollingAccuracy7d: accuracy.rollingAccuracy7d,
        byRiskLevel: accuracy.byRiskLevel,
        byAnalysisType: accuracy.byAnalysisType,
        byProvider: accuracy.byProvider,
        avgConfidenceCorrect: accuracy.avgConfidenceCorrect,
        avgConfidenceIncorrect: accuracy.avgConfidenceIncorrect,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return apiError('Internal server error', '500');
  }
}
