// Stats Service - Platform statistics

import { prisma } from '@/lib/prisma';

export class StatsService {
  /**
   * Get platform statistics
   */
  static async getStats() {
    const [
      totalAddresses,
      totalReports,
      totalScans,
      criticalThreats,
      recentReports,
      topReporters,
    ] = await Promise.all([
      // Total addresses tracked
      prisma.addresses.count(),

      // Total threat reports
      prisma.threat_reports.count(),

      // Total transaction scans
      prisma.transaction_scans.count(),

      // Critical threats (last 7 days)
      prisma.threat_reports.count({
        where: {
          riskLevel: 'CRITICAL',
          status: 'VERIFIED',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Recent reports (last 24h)
      prisma.threat_reports.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Top reporters
      prisma.reputation_scores.findMany({
        orderBy: { reporterScore: 'desc' },
        take: 10,
        include: {
          addresses: true,
        },
      }),
    ]);

    return {
      totalAddresses,
      totalReports,
      totalScans,
      criticalThreats,
      recentReports,
      topReporters: topReporters.map((r) => ({
        address: r.addresses.address,
        score: r.reporterScore,
        reportsSubmitted: r.reportsSubmitted,
        reportsVerified: r.reportsVerified,
      })),
    };
  }

  /**
   * Get leaderboard
   */
  static async getLeaderboard(limit: number = 50) {
    return prisma.reputation_scores.findMany({
      orderBy: { overallScore: 'desc' },
      take: limit,
      include: {
        addresses: true,
      },
    });
  }

  /**
   * Get user stats
   */
  static async getUserStats(address: string) {
    const profile = await prisma.user_profiles.findUnique({
      where: { address: address.toLowerCase() },
    });

    const reputation = await prisma.reputation_scores.findFirst({
      where: {
        addresses: {
          address: address.toLowerCase(),
        },
      },
    });

    return {
      profile,
      reputation,
    };
  }
}
