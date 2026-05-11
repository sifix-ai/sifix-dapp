// GET /api/v1/threats - List threat reports
// POST /api/v1/threats - Submit new threat report

import { NextRequest, NextResponse } from 'next/server';
import { ReportService, DuplicateReportError } from '@/services/report-service';
import { apiSuccess, apiError, errors } from '@/lib/api-response';
import { isValidEthereumAddress } from '@/lib/address-validation';
import { verifyApiAuth } from '@/lib/extension-auth';
import { uploadThreatEvidence } from '@/lib/zerog-storage';
import { reportThreatToContract, severityToNumber } from '@/lib/contract';
import { prisma } from '@/lib/prisma';

/** Maximum number of threat reports a client may request per page */
const MAX_THREATS_LIMIT = 100;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawLimit = parseInt(searchParams.get('limit') || '50');
    // Cap limit to prevent abuse
    const limit = Math.min(Math.max(rawLimit, 1), MAX_THREATS_LIMIT);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

    const reporterAddress = searchParams.get('reporter') || undefined;
    if (reporterAddress && !isValidEthereumAddress(reporterAddress)) {
      return apiError('Invalid reporter address format', '400');
    }

    const targetAddress = searchParams.get('address') || undefined;
    if (targetAddress && !isValidEthereumAddress(targetAddress)) {
      return apiError('Invalid target address format', '400');
    }

    const filters = {
      status: searchParams.get('status') as any,
      threatType: searchParams.get('threatType') as any,
      riskLevel: searchParams.get('riskLevel') as any,
      reporterAddress,
      address: targetAddress,
      limit,
      offset,
    };

    const reports = await ReportService.list(filters);

    return apiSuccess({
      reports: reports.reports.map((r) => ({
        id: r.id,
        address: r.address.address,
        reporterAddress: r.reporterAddress,
        threatType: r.threatType,
        severity: r.severity,
        riskLevel: r.riskLevel,
        explanation: r.explanation,
        status: r.status,
        confidence: r.confidence,
        createdAt: r.createdAt,
      })),
      total: reports.total,
    });
  } catch (error) {
    console.error('Error fetching threats:', error);
    return apiError('Internal server error', '500');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      // Canonical fields (service-layer)
      address,
      reporterAddress,
      threatType,
      severity,
      evidenceHash,
      explanation,
      transactionHash,
      confidence,
      simulationData,

      // Legacy /threats/report fields (0G Storage + on-chain)
      type,
      description,
      evidence,
    } = body;

    // ============================================
    // Mode A: Threat report with 0G Storage + on-chain
    // ============================================
    if (type && description && address && typeof severity === 'string') {
      // Auth required for on-chain reports
      const auth = await verifyApiAuth();
      if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
      }

      if (!isValidEthereumAddress(address)) {
        return apiError('Invalid address format', '400');
      }

      // 1. Upload evidence to 0G Storage
      let evidenceCid: string | null = null;
      try {
        const storageResult = await uploadThreatEvidence({
          address,
          severity,
          type,
          description,
          timestamp: Date.now(),
          transactionData: evidence?.transactionData,
          simulationResult: evidence?.simulationResult,
          aiAnalysis: evidence?.aiAnalysis,
        });
        evidenceCid = storageResult.cid;
      } catch (error) {
        console.error('[API] 0G Storage upload failed:', error);
      }

      // 2. Report to smart contract (only for HIGH/CRITICAL)
      let contractTxHash: string | null = null;
      if (evidenceCid && (severity === 'HIGH' || severity === 'CRITICAL')) {
        try {
          const contractResult = await reportThreatToContract(
            address as `0x${string}`,
            severityToNumber(severity),
            evidenceCid
          );
          if (contractResult.success) {
            contractTxHash = contractResult.txHash;
          }
        } catch (error) {
          console.error('[API] Contract report failed:', error);
        }
      }

      // 3. Persist using ReportService
      const severityScore = severityToNumber(severity);
      let report;
      try {
        report = await ReportService.create({
          address,
          reporterAddress: auth.walletAddress || '0x0000000000000000000000000000000000000000',
          threatType: type,
          severity: severityScore,
          evidenceHash: evidenceCid || `mock-${Date.now()}`,
          explanation: description,
          transactionHash: contractTxHash || undefined,
          confidence: 85,
          simulationData: evidence ? JSON.stringify(evidence) : undefined,
        });
      } catch (error) {
        if (error instanceof DuplicateReportError) {
          return errors.duplicateReport();
        }
        throw error;
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            id: report.id,
            address: report.address.address,
            threatType: report.threatType,
            severity: report.severity,
            riskLevel: report.riskLevel,
            status: report.status,
            createdAt: report.createdAt,
            storageCid: evidenceCid,
            contractTxHash,
          },
        },
        { status: 201 }
      );
    }

    // ============================================
    // Mode B: Standard threat report (service-layer)
    // ============================================
    // Support legacy body with addressId (convert to address)
    let finalAddress = address as string | undefined;
    if (!finalAddress && body.addressId) {
      const addressRecord = await prisma.address.findUnique({
        where: { id: body.addressId },
      });
      if (addressRecord) finalAddress = addressRecord.address;
    }

    if (!finalAddress || !isValidEthereumAddress(finalAddress)) {
      return apiError('Invalid address format', '400');
    }

    if (!reporterAddress || !isValidEthereumAddress(reporterAddress)) {
      return apiError('Invalid reporter address format', '400');
    }

    if (!threatType || !severity || !explanation || !confidence) {
      return apiError('Missing required fields', '400');
    }

    let report;
    try {
      report = await ReportService.create({
        address: finalAddress,
        reporterAddress,
        threatType,
        severity,
        evidenceHash: evidenceHash || `manual-${Date.now()}`,
        explanation,
        transactionHash,
        confidence,
        simulationData,
      });
    } catch (error) {
      if (error instanceof DuplicateReportError) {
        return errors.duplicateReport();
      }
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: report.id,
          address: report.address.address,
          threatType: report.threatType,
          severity: report.severity,
          riskLevel: report.riskLevel,
          status: report.status,
          createdAt: report.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating report:', error);
    return apiError('Internal server error', '500');
  }
}
