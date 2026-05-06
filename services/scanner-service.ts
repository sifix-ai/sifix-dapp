// Scanner Service - Transaction simulation and AI analysis

import { prisma } from '@/lib/prisma';
import type { RiskLevel } from '@prisma/client';
import { AddressService } from './address-service';
import { AIService } from './ai-service';

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
  confidence?: number;
}

export class ScannerService {
  /**
   * Scan transaction with AI analysis
   */
  static async scanTransaction(input: ScanTransactionInput): Promise<ScanResult> {
    // 1. Check if address exists in database
    const toAddress = await AddressService.getDetails(input.to);
    
    // 2. Analyze with AI
    const aiAnalysis = await AIService.analyzeTransaction({
      from: input.from,
      to: input.to,
      value: input.value || '0',
      data: input.data || '0x',
    });

    // 3. Combine with existing reputation if available
    let finalRiskScore = aiAnalysis.riskScore;
    if (toAddress && toAddress.riskScore > aiAnalysis.riskScore) {
      finalRiskScore = Math.max(toAddress.riskScore, aiAnalysis.riskScore);
    }

    // 4. Save scan to database
    await this.saveScan({
      from: input.from,
      to: input.to,
      value: input.value || '0',
      data: input.data || '0x',
      riskScore: finalRiskScore,
      riskLevel: aiAnalysis.riskLevel,
      aiAnalysis: aiAnalysis.explanation,
      userAddress: input.userAddress,
    });

    return {
      simulationSuccess: true,
      riskScore: finalRiskScore,
      riskLevel: aiAnalysis.riskLevel,
      recommendation: aiAnalysis.recommendation,
      explanation: aiAnalysis.explanation,
      detectedThreats: aiAnalysis.detectedThreats,
      confidence: aiAnalysis.confidence,
    };
  }

  /**
   * Save scan to database
   */
  private static async saveScan(data: {
    from: string;
    to: string;
    value: string;
    data: string;
    riskScore: number;
    riskLevel: RiskLevel;
    aiAnalysis: string;
    userAddress?: string;
  }) {
    try {
      // Get or create address
      const address = await AddressService.getOrCreate(data.to);

      await prisma.transactionScan.create({
        data: {
          addressId: address.id,
          fromAddress: data.from.toLowerCase(),
          toAddress: data.to.toLowerCase(),
          value: data.value,
          data: data.data,
          riskScore: data.riskScore,
          riskLevel: data.riskLevel,
          aiAnalysis: data.aiAnalysis,
          userAddress: data.userAddress?.toLowerCase(),
        },
      });
    } catch (error) {
      console.error('Failed to save scan:', error);
    }
  }

  /**
   * Get scan history for address
   */
  static async getScanHistory(address: string, limit: number = 10) {
    return prisma.transactionScan.findMany({
      where: {
        OR: [
          { fromAddress: address.toLowerCase() },
          { toAddress: address.toLowerCase() },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
