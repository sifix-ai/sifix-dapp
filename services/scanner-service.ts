// Scanner Service - Transaction simulation and AI analysis

import { prisma } from '@/lib/prisma';
import type { RiskLevel } from '@prisma/client';
import { AddressService } from './address-service';

export interface ScanTransactionInput {
  from: string;
  to: string;
  value?: string;
  data?: string;
  userAddress?: string;
}

export interface ScanResult {
  simulationSuccess: boolean;
  gasUsed?: string;
  stateChanges?: string;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendation: 'APPROVE' | 'REJECT' | 'WARN';
  explanation: string;
  detectedThreats?: string[];
}

export class ScannerService {
  /**
   * Scan transaction via SIFIX Agent
   */
  static async scanTransaction(input: ScanTransactionInput): Promise<ScanResult> {
    // TODO: Call SIFIX Agent API
    // For now, return mock data based on address reputation
    
    const toAddress = await AddressService.getDetails(input.to);
    
    if (!toAddress) {
      // Unknown address - low risk by default
      return {
        simulationSuccess: true,
        riskScore: 20,
        riskLevel: 'LOW',
        recommendation: 'APPROVE',
        explanation: 'Address not found in threat database. Transaction appears safe.',
      };
    }

    // Use existing risk score
    const riskScore = toAddress.riskScore;
    let recommendation: 'APPROVE' | 'REJECT' | 'WARN' = 'APPROVE';
    
    if (riskScore >= 80) recommendation = 'REJECT';
    else if (riskScore >= 40) recommendation = 'WARN';

    const threats = toAddress.reports
      .filter((r) => r.status === 'VERIFIED')
      .map((r) => r.threatType);

    return {
      simulationSuccess: true,
      riskScore,
      riskLevel: toAddress.riskLevel,
      recommendation,
      explanation: this.generateExplanation(toAddress.riskLevel, threats),
      detectedThreats: threats,
    };
  }

  /**
   * Save scan result to database
   */
  static async saveScan(input: ScanTransactionInput, result: ScanResult) {
    const address = await AddressService.getOrCreate(input.to);

    return prisma.transactionScan.create({
      data: {
        addressId: address.id,
        from: input.from.toLowerCase(),
        to: input.to.toLowerCase(),
        value: input.value,
        data: input.data,
        simulationSuccess: result.simulationSuccess,
        gasUsed: result.gasUsed,
        stateChanges: result.stateChanges,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        recommendation: result.recommendation,
        explanation: result.explanation,
        detectedThreats: result.detectedThreats ? JSON.stringify(result.detectedThreats) : null,
      },
    });
  }

  /**
   * Get scan history for user
   */
  static async getHistory(userAddress: string, limit: number = 50) {
    return prisma.transactionScan.findMany({
      where: { from: userAddress.toLowerCase() },
      include: {
        address: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Generate explanation based on risk level
   */
  private static generateExplanation(riskLevel: RiskLevel, threats: string[]): string {
    if (riskLevel === 'CRITICAL') {
      return `⛔ CRITICAL THREAT DETECTED! This address has been reported for ${threats.join(', ')}. DO NOT PROCEED with this transaction.`;
    }
    if (riskLevel === 'HIGH') {
      return `⚠️ HIGH RISK! This address has been flagged for ${threats.join(', ')}. Proceed with extreme caution.`;
    }
    if (riskLevel === 'MEDIUM') {
      return `⚡ MEDIUM RISK. This address has some reports for ${threats.join(', ')}. Review carefully before proceeding.`;
    }
    return '✅ LOW RISK. No significant threats detected. Transaction appears safe.';
  }
}
