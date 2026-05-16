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
      prisma.address.count(),

      // Total threat reports
      prisma.threatReport.count(),

      // Total transaction scans
      prisma.transactionScan.count(),

      // Critical threats (last 7 days)
      prisma.threatReport.count({
        where: {
          riskLevel: 'CRITICAL',
          status: 'VERIFIED',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Recent reports (last 24h)
      prisma.threatReport.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Top reporters
      prisma.reputationScore.findMany({
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
    return prisma.reputationScore.findMany({
      orderBy: { overallScore: 'desc' },
      take: limit,
      include: {
        address: true,
      },
    });
  }

  /**
   * Get user stats
   */
  static async getUserStats(address: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { address: address.toLowerCase() },
    });

    const reputation = await prisma.reputationScore.findFirst({
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
