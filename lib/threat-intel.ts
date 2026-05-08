import { prisma } from '@/lib/prisma';
import type { ThreatIntelProvider, AddressThreatIntel, ScanSummary } from '@sifix/agent';
import type { Address } from 'viem';

/**
 * Prisma-based threat intelligence provider.
 * Implements @sifix/agent ThreatIntelProvider interface
 * to enable learning from past scan results.
 */
export class PrismaThreatIntel implements ThreatIntelProvider {
  /**
   * Get aggregated threat intel for an address.
   * Queries all scan_history records where this address
   * appears as either fromAddress or toAddress.
   */
  async getAddressIntel(address: Address): Promise<AddressThreatIntel | null> {
    // Normalize to lowercase for consistent matching
    const addr = address.toLowerCase();

    const scans = await prisma.scanHistory.findMany({
      where: {
        OR: [
          { fromAddress: { equals: addr, mode: 'insensitive' } },
          { toAddress: { equals: addr, mode: 'insensitive' } },
        ],
      },
      orderBy: { analyzedAt: 'desc' },
      take: 50, // Last 50 scans for aggregation
    });

    if (scans.length === 0) {
      return null;
    }

    // Aggregate stats
    const riskScores = scans.map((s) => s.riskScore);
    const avgRiskScore = Math.round(riskScores.reduce((a, b) => a + b, 0) / riskScores.length);
    const maxRiskScore = Math.max(...riskScores);

    // Collect all unique threats
    const allThreats = new Set<string>();
    for (const scan of scans) {
      if (scan.threats) {
        try {
          const threats: string[] = JSON.parse(scan.threats);
          threats.forEach((t) => allThreats.add(t));
        } catch {
          // Skip invalid JSON
        }
      }
    }

    // Risk level distribution
    const riskDistribution = {
      safe: scans.filter((s) => s.riskLevel === 'SAFE').length,
      low: scans.filter((s) => s.riskLevel === 'LOW').length,
      medium: scans.filter((s) => s.riskLevel === 'MEDIUM').length,
      high: scans.filter((s) => s.riskLevel === 'HIGH').length,
      critical: scans.filter((s) => s.riskLevel === 'CRITICAL').length,
    };

    // Map to ScanSummary for recent scans
    const recentScans: ScanSummary[] = scans.slice(0, 10).map((s) => ({
      address: s.toAddress as Address,
      riskScore: s.riskScore,
      riskLevel: s.riskLevel,
      recommendation: s.recommendation,
      threats: s.threats ? JSON.parse(s.threats) : [],
      timestamp: s.analyzedAt.toISOString(),
      rootHash: s.rootHash || undefined,
    }));

    return {
      address,
      totalScans: scans.length,
      avgRiskScore,
      maxRiskScore,
      knownThreats: Array.from(allThreats),
      lastRecommendation: scans[0]?.recommendation || null,
      riskDistribution,
      recentScans,
      firstSeen: scans[scans.length - 1]?.analyzedAt.toISOString() || null,
      lastSeen: scans[0]?.analyzedAt.toISOString() || null,
    };
  }

  /**
   * Save a scan result to the database for future threat intel lookups.
   */
  async saveScanResult(result: {
    from: Address;
    to: Address;
    riskScore: number;
    riskLevel: string;
    recommendation: string;
    reasoning: string;
    threats: string[];
    confidence: number;
    timestamp: string;
    rootHash?: string;
    storageExplorer?: string;
  }): Promise<void> {
    await prisma.scanHistory.create({
      data: {
        fromAddress: result.from,
        toAddress: result.to,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        recommendation: result.recommendation,
        reasoning: result.reasoning,
        threats: JSON.stringify(result.threats),
        confidence: result.confidence,
        rootHash: result.rootHash || null,
        storageExplorer: result.storageExplorer || null,
        analyzedAt: new Date(result.timestamp),
      },
    });
  }
}
