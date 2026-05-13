import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { AccuracyService } from '@/services/accuracy-service'

type PredictionFilter = 'all' | 'resolved' | 'unresolved' | 'false_positive' | 'false_negative'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200)
    const rawFilter = (searchParams.get('filter') || 'all') as PredictionFilter

    const validFilters: PredictionFilter[] = ['all', 'resolved', 'unresolved', 'false_positive', 'false_negative']
    const filter: PredictionFilter = validFilters.includes(rawFilter) ? rawFilter : 'all'

    const rows = await AccuracyService.getRecent({ limit, filter })

    const data = rows.map((row) => {
      let parsedThreats: string[] = []
      try {
        parsedThreats = row.predictedThreats ? JSON.parse(row.predictedThreats) : []
      } catch {
        parsedThreats = []
      }

      const fp = row.isCorrect === false && ['HIGH', 'CRITICAL'].includes(row.predictedRiskLevel)
      const fn = row.isCorrect === false && ['SAFE', 'LOW'].includes(row.predictedRiskLevel)

      return {
        id: row.id,
        targetAddress: row.targetAddress,
        analysisType: row.analysisType,
        predictedRiskScore: row.predictedRiskScore,
        predictedRiskLevel: row.predictedRiskLevel,
        predictedConfidence: row.predictedConfidence,
        predictedRecommendation: row.predictedRecommendation,
        predictedThreats: parsedThreats,
        provider: row.provider,
        actualOutcome: row.actualOutcome,
        isCorrect: row.isCorrect,
        groundTruthSource: row.groundTruthSource,
        goPlusRiskScore: row.goPlusRiskScore,
        communityRiskLevel: row.communityRiskLevel,
        resolvedAt: row.resolvedAt?.toISOString() || null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        tags: {
          falsePositive: fp,
          falseNegative: fn,
          status: row.isCorrect === null ? 'pending' : row.isCorrect ? 'correct' : 'wrong',
        },
      }
    })

    const summary = {
      total: data.length,
      pending: data.filter((d) => d.isCorrect === null).length,
      correct: data.filter((d) => d.isCorrect === true).length,
      wrong: data.filter((d) => d.isCorrect === false).length,
      falsePositive: data.filter((d) => d.tags.falsePositive).length,
      falseNegative: data.filter((d) => d.tags.falseNegative).length,
    }

    return apiSuccess({ filter, limit, summary, predictions: data })
  } catch (error) {
    console.error('Recent predictions error:', error)
    return apiError('Internal server error', '500')
  }
}
