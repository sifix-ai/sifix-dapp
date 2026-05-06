// Report Service - Threat report management

import { prisma } from '@/lib/prisma';
import type { ThreatType, RiskLevel, ReportStatus } from '@prisma/client';
import { AddressService } from './address-service';

export interface CreateReportInput {
  address: string;
  reporterAddress: string;
  threatType: ThreatType;
  severity: number;
  evidenceHash: string;
  explanation: string;
  transactionHash?: string;
  aiModel?: string;
  confidence: number;
  simulationData?: string;
}

export class ReportService {
  /**
   * Create new threat report
   */
  static async create(input: CreateReportInput) {
    // Get or create address
    const address = await AddressService.getOrCreate(input.address);

    // Determine risk level from severity
    let riskLevel: RiskLevel = 'LOW';
    if (input.severity >= 80) riskLevel = 'CRITICAL';
    else if (input.severity >= 60) riskLevel = 'HIGH';
    else if (input.severity >= 40) riskLevel = 'MEDIUM';

    // Create report
    const report = await prisma.threatReport.create({
      data: {
        addressId: address.id,
        reporterAddress: input.reporterAddress.toLowerCase(),
        threatType: input.threatType,
        severity: input.severity,
        riskLevel,
        evidenceHash: input.evidenceHash,
        explanation: input.explanation,
        transactionHash: input.transactionHash,
        aiModel: input.aiModel || 'gpt-4',
        confidence: input.confidence,
        simulationData: input.simulationData,
        status: input.confidence >= 90 ? 'VERIFIED' : 'PENDING',
      },
      include: {
        address: true,
      },
    });

    // Update address risk score
    await AddressService.updateRiskScore(address.id);

    // Update reporter reputation
    await this.updateReporterReputation(input.reporterAddress);

    return report;
  }

  /**
   * Get report by ID
   */
  static async getById(id: string) {
    return prisma.threatReport.findUnique({
      where: { id },
      include: {
        address: true,
      },
    });
  }

  /**
   * List reports with filters
   */
  static async list(filters: {
    status?: ReportStatus;
    threatType?: ThreatType;
    riskLevel?: RiskLevel;
    reporterAddress?: string;
    limit?: number;
    offset?: number;
  }) {
    const { limit = 50, offset = 0, ...where } = filters;

    return prisma.threatReport.findMany({
      where,
      include: {
        address: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Verify report (admin/community action)
   */
  static async verify(id: string, verifiedBy: string) {
    const report = await prisma.threatReport.update({
      where: { id },
      data: {
        status: 'VERIFIED',
        verifiedBy: verifiedBy.toLowerCase(),
        verifiedAt: new Date(),
      },
      include: {
        address: true,
      },
    });

    // Update address risk score
    await AddressService.updateRiskScore(report.addressId);

    return report;
  }

  /**
   * Update reporter reputation
   */
  private static async updateReporterReputation(reporterAddress: string) {
    const addr = await AddressService.getOrCreate(reporterAddress);

    const stats = await prisma.threatReport.groupBy({
      by: ['status'],
      where: { reporterAddress: reporterAddress.toLowerCase() },
      _count: true,
    });

    const submitted = stats.reduce((sum, s) => sum + s._count, 0);
    const verified = stats.find((s) => s.status === 'VERIFIED')?._count || 0;
    const rejected = stats.find((s) => s.status === 'REJECTED')?._count || 0;

    const accuracyScore = submitted > 0 ? Math.round((verified / submitted) * 100) : 0;
    const reporterScore = Math.min(100, verified * 5); // 5 points per verified report

    await prisma.reputationScore.upsert({
      where: { addressId: addr.id },
      create: {
        addressId: addr.id,
        overallScore: accuracyScore,
        reporterScore,
        accuracyScore,
        reportsSubmitted: submitted,
        reportsVerified: verified,
        reportsRejected: rejected,
      },
      update: {
        overallScore: accuracyScore,
        reporterScore,
        accuracyScore,
        reportsSubmitted: submitted,
        reportsVerified: verified,
        reportsRejected: rejected,
      },
    });
  }
}
