import { prisma } from '@/lib/prisma';
import type { ThreatIntelProvider, AddressThreatIntel, ScanSummary } from '@sifix/agent';
import type { Address } from 'viem';

function sanitizeThreats(input: unknown, maxItems = 5): string[] {
  const source = Array.isArray(input) ? input : [input];

  const tokens = source
    .flatMap((item) => String(item ?? '').split(/\n|Known threats:/gi))
    .flatMap((item) => item.split(/,(?=\s*[A-Z])/g))
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .map((s) => s.replace(/^[,;:\-\s]+|[,;:\-\s]+$/g, '').trim())
    .filter(Boolean)
    .filter((s) => s.length <= 180)
    .filter((s) => !/^known threats:?$/i.test(s));

  const seen = new Set<string>();
  const cleaned: string[] = [];

  for (const token of tokens) {
    const key = token
      .toLowerCase()
      .replace(/^[,;:\-\s]+|[,;:\-\s]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!key || seen.has(key)) continue;
    seen.add(key);
    cleaned.push(token);
    if (cleaned.length >= maxItems) break;
  }

  return cleaned;
}

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
    const allThreats: string[] = [];
    for (const scan of scans) {
      if (scan.threats) {
        try {
          const threats: string[] = JSON.parse(scan.threats);
          allThreats.push(...sanitizeThreats(threats, 50));
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
      threats: s.threats ? sanitizeThreats(JSON.parse(s.threats), 5) : [],
      timestamp: s.analyzedAt.toISOString(),
      rootHash: s.rootHash || undefined,
    }));

    return {
      address,
      totalScans: scans.length,
      avgRiskScore,
      maxRiskScore,
      knownThreats: sanitizeThreats(allThreats, 5),
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
