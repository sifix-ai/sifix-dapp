// Report Service - Threat report management

import { prisma } from '@/lib/prisma';

export class DuplicateReportError extends Error {
  code = 'DUPLICATE_REPORT';

  constructor(message: string = 'You have already reported this address') {
    super(message);
    this.name = 'DuplicateReportError';
  }
}


export interface CreateReportInput {
  address: string;
  reporterAddress: string;
  threatType: string;
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
    let addressRecord = await prisma.addresses.findUnique({
      where: { address: input.address }
    });

    if (!addressRecord) {
      addressRecord = await prisma.addresses.create({
        data: { address: input.address }
      });
    }

    // Duplicate guard: 1 report per reporter per address
    const existing = await prisma.threat_reports.findFirst({
      where: {
        addressId: addressRecord.id,
        reporterAddress: input.reporterAddress.toLowerCase(),
      },
    });
    if (existing) {
      throw new DuplicateReportError();
    }

    // Determine risk level from severity
    let riskLevel = 'LOW';
    if (input.severity >= 80) riskLevel = 'CRITICAL';
    else if (input.severity >= 60) riskLevel = 'HIGH';
    else if (input.severity >= 40) riskLevel = 'MEDIUM';

    // Create report
    const report = await prisma.threat_reports.create({
      data: {
        addressId: addressRecord.id,
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
        status: 'PENDING',
        localStatus: 'QUEUED',
        onchainStatus: 'NONE',
      },
      include: {
        addresses: true,
      },
    });

    // Update address risk score
    await this.updateAddressRiskScore(addressRecord.id);

    return report;
  }

  /**
   * Get report by ID
   */
  static async getById(id: string) {
    return prisma.threat_reports.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });
  }

  /**
   * List reports with filters
   */
  static async list(filters?: {
    status?: string;
    threatType?: string;
    riskLevel?: string;
    address?: string;
    reporterAddress?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    
    if (filters?.status) where.status = filters.status;
    if (filters?.threatType) where.threatType = filters.threatType;
    if (filters?.riskLevel) where.riskLevel = filters.riskLevel;
    if (filters?.reporterAddress) where.reporterAddress = filters.reporterAddress.toLowerCase();
    if (filters?.address) {
      where.address = {
        address: filters.address.toLowerCase(),
      };
    }

    const [reports, total] = await Promise.all([
      prisma.threat_reports.findMany({
        where,
        include: {
          addresses: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      }),
      prisma.threat_reports.count({ where }),
    ]);

    return { reports, total };
  }

  /**
   * Update report status
   */
  static async updateStatus(id: string, status: string, verifiedBy?: string) {
    return prisma.threat_reports.update({
      where: { id },
      data: {
        status,
        verifiedBy,
        verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
      },
    });
  }

  /**
   * Get reports for address
   */
  static async getByAddress(address: string) {
    const addressRecord = await prisma.addresses.findUnique({
      where: { address },
      include: {
        threat_reports: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return addressRecord?.threat_reports || [];
  }

  /**
   * Update address risk score based on reports
   */
  private static async updateAddressRiskScore(addressId: string) {
    const reports = await prisma.threat_reports.findMany({
      where: { addressId },
    });

    if (reports.length === 0) return;

    // Calculate average severity
    const avgSeverity = reports.reduce((sum, r) => sum + r.severity, 0) / reports.length;
    
    // Determine risk level
    let riskLevel = 'LOW';
    if (avgSeverity >= 80) riskLevel = 'CRITICAL';
    else if (avgSeverity >= 60) riskLevel = 'HIGH';
    else if (avgSeverity >= 40) riskLevel = 'MEDIUM';

    // Update address
    await prisma.addresses.update({
      where: { id: addressId },
      data: {
        riskScore: Math.round(avgSeverity),
        riskLevel,
        totalReports: reports.length,
        lastSeenAt: new Date(),
      },
    });
  }
}
