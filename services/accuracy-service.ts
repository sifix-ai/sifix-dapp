/**
 * Accuracy Tracking Service
 *
 * Tracks prediction accuracy over time for the AI security analyzer.
 * Compares AI risk predictions against community consensus (votes)
 * and GoPlus data when available.
 *
 * Stores per-prediction outcomes in PredictionAccuracy table.
 * Computes aggregate accuracy stats for reporting.
 */

import { prisma } from '@/lib/prisma'

// ── Types ───────────────────────────────────────────────

export interface PredictionRecord {
  id?: string
  /** Address or target that was analyzed */
  targetAddress: string
  /** 'transaction' | 'signature' | 'address_scan' */
  analysisType: string
  /** AI predicted risk score 0-100 */
  predictedRiskScore: number
  /** AI predicted risk level */
  predictedRiskLevel: string
  /** AI confidence 0-100 */
  predictedConfidence: number
  /** AI recommendation */
  predictedRecommendation: string
  /** Threats the AI flagged */
  predictedThreats: string[]
  /** AI provider used */
  provider: string
  /** Actual outcome — set later */
  actualOutcome?: string | null
  /** Was prediction correct? */
  isCorrect?: boolean | null
  /** Ground truth source */
  groundTruthSource?: string | null
  /** GoPlus risk score at time of prediction */
  goPlusRiskScore?: number | null
  /** Community consensus risk level */
  communityRiskLevel?: string | null
  /** When outcome was resolved */
  resolvedAt?: Date | null
}

export interface AccuracyStats {
  totalPredictions: number
  resolvedPredictions: number
  correctPredictions: number
  accuracy: number
  /** Accuracy per risk level bucket */
  byRiskLevel: Record<string, { total: number; correct: number; accuracy: number }>
  /** Accuracy per analysis type */
  byAnalysisType: Record<string, { total: number; correct: number; accuracy: number }>
  /** Accuracy per provider */
  byProvider: Record<string, { total: number; correct: number; accuracy: number }>
  /** Average confidence of correct vs incorrect predictions */
  avgConfidenceCorrect: number
  avgConfidenceIncorrect: number
  /** Rolling 7-day accuracy */
  rollingAccuracy7d: number
}

// ── Service ─────────────────────────────────────────────

export class AccuracyService {
  /**
   * Record a new prediction at analysis time.
   * Returns the created record ID.
   */
  static async recordPrediction(input: PredictionRecord): Promise<string> {
    const record = await prisma.prediction_accuracy.create({
      data: {
        targetAddress: input.targetAddress.toLowerCase(),
        analysisType: input.analysisType,
        predictedRiskScore: input.predictedRiskScore,
        predictedRiskLevel: input.predictedRiskLevel,
        predictedConfidence: input.predictedConfidence,
        predictedRecommendation: input.predictedRecommendation,
        predictedThreats: JSON.stringify(input.predictedThreats),
        provider: input.provider,
        actualOutcome: input.actualOutcome ?? null,
        isCorrect: input.isCorrect ?? null,
        groundTruthSource: input.groundTruthSource ?? null,
        goPlusRiskScore: input.goPlusRiskScore ?? null,
        communityRiskLevel: input.communityRiskLevel ?? null,
        resolvedAt: input.resolvedAt ?? null,
        // updatedAt is auto-managed by @updatedAt directive
      },
    })
    return record.id
  }

  /**
   * Resolve a prediction with actual outcome.
   * Compares predicted vs actual to determine correctness.
   */
  static async resolvePrediction(
    id: string,
    actual: {
      outcome: string
      isCorrect: boolean
      groundTruthSource: string
      communityRiskLevel?: string
    },
  ): Promise<void> {
    await prisma.prediction_accuracy.update({
      where: { id },
      data: {
        actualOutcome: actual.outcome,
        isCorrect: actual.isCorrect,
        groundTruthSource: actual.groundTruthSource,
        communityRiskLevel: actual.communityRiskLevel ?? null,
        resolvedAt: new Date(),
      },
    })
  }

  /**
   * Resolve predictions for a target address using GoPlus data as ground truth.
   * Marks predictions as correct if the risk level matches.
   */
  static async resolveWithGoPlus(
    targetAddress: string,
    goPlusRiskLevel: string,
    goPlusRiskScore: number,
  ): Promise<number> {
    // Find unresolved predictions for this address
    const unresolved = await prisma.prediction_accuracy.findMany({
      where: {
        targetAddress: targetAddress.toLowerCase(),
        isCorrect: null,
      },
    })

    let resolved = 0
    for (const pred of unresolved) {
      // Consider it correct if both predicted and GoPlus agree on high/low
      const predHigh = ['HIGH', 'CRITICAL'].includes(pred.predictedRiskLevel)
      const gpHigh = ['HIGH', 'CRITICAL'].includes(goPlusRiskLevel)
      const predLow = ['SAFE', 'LOW'].includes(pred.predictedRiskLevel)
      const gpLow = ['SAFE', 'LOW'].includes(goPlusRiskLevel)

      const isCorrect = (predHigh && gpHigh) || (predLow && gpLow)

      await prisma.prediction_accuracy.update({
        where: { id: pred.id },
        data: {
          actualOutcome: `goplus:${goPlusRiskLevel}`,
          isCorrect,
          groundTruthSource: 'goplus',
          goPlusRiskScore,
          communityRiskLevel: goPlusRiskLevel,
          resolvedAt: new Date(),
        },
      })
      resolved++
    }
    return resolved
  }

  /**
   * Resolve predictions using community vote consensus.
   */
  static async resolveWithCommunity(
    targetAddress: string,
    communityConsensus: 'malicious' | 'benign' | 'unclear',
    communityRiskLevel: string,
  ): Promise<number> {
    const unresolved = await prisma.prediction_accuracy.findMany({
      where: {
        targetAddress: targetAddress.toLowerCase(),
        isCorrect: null,
      },
    })

    let resolved = 0
    for (const pred of unresolved) {
      const predHigh = ['HIGH', 'CRITICAL'].includes(pred.predictedRiskLevel)
      const commHigh = communityConsensus === 'malicious'
      const predLow = ['SAFE', 'LOW'].includes(pred.predictedRiskLevel)
      const commLow = communityConsensus === 'benign'

      const isCorrect = communityConsensus === 'unclear' ? null : (predHigh && commHigh) || (predLow && commLow)

      await prisma.prediction_accuracy.update({
        where: { id: pred.id },
        data: {
          actualOutcome: `community:${communityConsensus}`,
          isCorrect,
          groundTruthSource: 'community',
          communityRiskLevel,
          resolvedAt: new Date(),
        },
      })
      resolved++
    }
    return resolved
  }

  /**
   * Compute aggregate accuracy stats.
   */
  static async getStats(since?: Date): Promise<AccuracyStats> {
    const where: any = {}
    if (since) where.createdAt = { gte: since }

    const all = await prisma.prediction_accuracy.findMany({ where })

    const resolved = all.filter((p) => p.isCorrect !== null)
    const correct = resolved.filter((p) => p.isCorrect === true)

    // By risk level
    const byRiskLevel: Record<string, { total: number; correct: number; accuracy: number }> = {}
    for (const r of resolved) {
      const lvl = r.predictedRiskLevel
      if (!byRiskLevel[lvl]) byRiskLevel[lvl] = { total: 0, correct: 0, accuracy: 0 }
      byRiskLevel[lvl].total++
      if (r.isCorrect) byRiskLevel[lvl].correct++
    }
    for (const k of Object.keys(byRiskLevel)) {
      const b = byRiskLevel[k]
      b.accuracy = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0
    }

    // By analysis type
    const byAnalysisType: Record<string, { total: number; correct: number; accuracy: number }> = {}
    for (const r of resolved) {
      const t = r.analysisType
      if (!byAnalysisType[t]) byAnalysisType[t] = { total: 0, correct: 0, accuracy: 0 }
      byAnalysisType[t].total++
      if (r.isCorrect) byAnalysisType[t].correct++
    }
    for (const k of Object.keys(byAnalysisType)) {
      const b = byAnalysisType[k]
      b.accuracy = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0
    }

    // By provider
    const byProvider: Record<string, { total: number; correct: number; accuracy: number }> = {}
    for (const r of resolved) {
      const p = r.provider || 'unknown'
      if (!byProvider[p]) byProvider[p] = { total: 0, correct: 0, accuracy: 0 }
      byProvider[p].total++
      if (r.isCorrect) byProvider[p].correct++
    }
    for (const k of Object.keys(byProvider)) {
      const b = byProvider[k]
      b.accuracy = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0
    }

    // Confidence analysis
    const correctRecords = resolved.filter((r) => r.isCorrect === true)
    const incorrectRecords = resolved.filter((r) => r.isCorrect === false)
    const avgConfidenceCorrect = correctRecords.length > 0
      ? Math.round(correctRecords.reduce((s, r) => s + r.predictedConfidence, 0) / correctRecords.length)
      : 0
    const avgConfidenceIncorrect = incorrectRecords.length > 0
      ? Math.round(incorrectRecords.reduce((s, r) => s + r.predictedConfidence, 0) / incorrectRecords.length)
      : 0

    // 7-day rolling accuracy
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentResolved = resolved.filter((r) => r.resolvedAt && new Date(r.resolvedAt) >= sevenDaysAgo)
    const recentCorrect = recentResolved.filter((r) => r.isCorrect === true)
    const rollingAccuracy7d = recentResolved.length > 0
      ? Math.round((recentCorrect.length / recentResolved.length) * 100)
      : 0

    return {
      totalPredictions: all.length,
      resolvedPredictions: resolved.length,
      correctPredictions: correct.length,
      accuracy: resolved.length > 0 ? Math.round((correct.length / resolved.length) * 100) : 0,
      byRiskLevel,
      byAnalysisType,
      byProvider,
      avgConfidenceCorrect,
      avgConfidenceIncorrect,
      rollingAccuracy7d,
    }
  }

  /**
   * Get recent predictions for display.
   */
  static async getRecent(options?: {
    limit?: number
    filter?: 'all' | 'resolved' | 'unresolved' | 'false_positive' | 'false_negative'
  }) {
    const limit = options?.limit || 50
    const filter = options?.filter || 'all'

    const where: any = {}
    if (filter === 'resolved') where.isCorrect = { not: null }
    if (filter === 'unresolved') where.isCorrect = null
    if (filter === 'false_positive') {
      where.isCorrect = false
      where.predictedRiskLevel = { in: ['HIGH', 'CRITICAL'] }
    }
    if (filter === 'false_negative') {
      where.isCorrect = false
      where.predictedRiskLevel = { in: ['SAFE', 'LOW'] }
    }

    return prisma.predictionAccuracy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  /**
   * Get unresolved predictions older than N hours (for auto-resolution).
   */
  static async getStaleUnresolved(olderThanHours = 72): Promise<string[]> {
    const cutoff = new Date()
    cutoff.setHours(cutoff.getHours() - olderThanHours)
    const records = await prisma.predictionAccuracy.findMany({
      where: {
        isCorrect: null,
        createdAt: { lt: cutoff },
      },
      select: { id: true },
    })
    return records.map((r) => r.id)
  }
}
