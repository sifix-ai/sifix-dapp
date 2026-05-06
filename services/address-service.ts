// Address Service - SIFIX threat intelligence queries

import { prisma } from '@/lib/prisma';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export class AddressService {
  /**
   * Get or create address
   */
  static async getOrCreate(address: string, chain: string = '0g-newton') {
    let addr = await prisma.address.findUnique({
      where: { address: address.toLowerCase() },
      include: {
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        reputation: true,
      },
    });

    if (!addr) {
      addr = await prisma.address.create({
        data: {
          address: address.toLowerCase(),
          chain,
        },
        include: {
          reports: true,
          reputation: true,
        },
      });
    }

    return addr;
  }

  /**
   * Get address with full details
   */
  static async getDetails(address: string) {
    return prisma.address.findUnique({
      where: { address: address.toLowerCase() },
      include: {
        reports: {
          orderBy: { createdAt: 'desc' },
        },
        scans: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        reputation: true,
      },
    });
  }

  /**
   * Update risk score based on reports
   */
  static async updateRiskScore(addressId: string) {
    const reports = await prisma.threatReport.findMany({
      where: { addressId, status: 'VERIFIED' },
    });

    if (reports.length === 0) return;

    // Calculate average severity
    const avgSeverity = Math.round(
      reports.reduce((sum, r) => sum + r.severity, 0) / reports.length
    );

    // Determine risk level
    let riskLevel: RiskLevel = 'LOW';
    if (avgSeverity >= 80) riskLevel = 'CRITICAL';
    else if (avgSeverity >= 60) riskLevel = 'HIGH';
    else if (avgSeverity >= 40) riskLevel = 'MEDIUM';

    await prisma.address.update({
      where: { id: addressId },
      data: {
        riskScore: avgSeverity,
        riskLevel,
        totalReports: reports.length,
        lastSeenAt: new Date(),
      },
    });
  }

  /**
   * Search addresses by risk level
   */
  static async searchByRisk(riskLevel: RiskLevel, limit: number = 50) {
    return prisma.address.findMany({
      where: { riskLevel },
      include: {
        reports: {
          where: { status: 'VERIFIED' },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { riskScore: 'desc' },
      take: limit,
    });
  }

  /**
   * Get recent threats
   */
  static async getRecentThreats(limit: number = 20) {
    return prisma.threatReport.findMany({
      where: {
        riskLevel: { in: ['HIGH', 'CRITICAL'] },
        status: 'VERIFIED',
      },
      include: {
        address: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
