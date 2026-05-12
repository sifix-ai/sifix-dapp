// GET /api/v1/threats - List threat reports
// POST /api/v1/threats - Submit new threat report

import { NextRequest, NextResponse } from 'next/server';
import { ReportService, DuplicateReportError } from '@/services/report-service';
import { apiSuccess, apiError, errors } from '@/lib/api-response';
import { isValidEthereumAddress } from '@/lib/address-validation';
import { verifyApiAuth } from '@/lib/extension-auth';

/** Maximum number of threat reports a client may request per page */
const MAX_THREATS_LIMIT = 100;

const ZERO_G_RPC_URL = 'https://evmrpc-testnet.0g.ai';
const SCAM_REPORTER_ADDRESS = '0x544a39149d5169e4e1bdf7f8492804224cb70152';
const SCAM_VOTE_SUBMITTED_TOPIC0 = '0x4866b80505de2a9f11bc92df30aba8d340b203e4e3700be812a4477860fb7c21';

interface JsonRpcReceiptLog {
  address: string;
  topics: string[];
}

interface JsonRpcReceipt {
  logs: JsonRpcReceiptLog[];
}

async function hasValidScamVoteEvent(txHash: string): Promise<boolean> {
  const response = await fetch(ZERO_G_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getTransactionReceipt',
      params: [txHash],
    }),
  });

  if (!response.ok) {
    return false;
  }

  const payload = (await response.json()) as {
    result?: JsonRpcReceipt | null;
    error?: { message?: string };
  };

  if (!payload.result || !Array.isArray(payload.result.logs)) {
    return false;
  }

  return payload.result.logs.some((log) => {
    const topic0 = log.topics?.[0]?.toLowerCase();
    return (
      log.address?.toLowerCase() === SCAM_REPORTER_ADDRESS &&
      topic0 === SCAM_VOTE_SUBMITTED_TOPIC0
    );
  });
}

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
        localStatus: r.localStatus,
        onchainStatus: r.onchainStatus,
        onchainTxHash: r.onchainTxHash,
        chainId: r.chainId,
        contractAddress: r.contractAddress,
        relayedAt: r.relayedAt,
        relayError: r.relayError,
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
    // Strict auth: token is mandatory
    const auth = await verifyApiAuth();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const {
      address,
      reporterAddress,
      threatType,
      severity,
      evidenceHash,
      explanation,
      txHash,
      confidence,
      simulationData,
    } = body as {
      address?: string;
      reporterAddress?: string;
      threatType?: string;
      severity?: number;
      evidenceHash?: string;
      explanation?: string;
      txHash?: string;
      confidence?: number;
      simulationData?: string;
    };

    if (!address || !isValidEthereumAddress(address)) {
      return apiError('Invalid address format', '400');
    }

    if (!reporterAddress || !isValidEthereumAddress(reporterAddress)) {
      return apiError('Invalid reporter address format', '400');
    }

    if (!threatType || typeof threatType !== 'string') {
      return apiError('Missing required field: threatType', '400');
    }

    if (typeof severity !== 'number' || Number.isNaN(severity)) {
      return apiError('Missing or invalid required field: severity', '400');
    }

    if (!explanation || typeof explanation !== 'string') {
      return apiError('Missing required field: explanation', '400');
    }

    if (!txHash || typeof txHash !== 'string') {
      return apiError('Missing required field: txHash', '400');
    }

    const isValidTx = await hasValidScamVoteEvent(txHash);
    if (!isValidTx) {
      return apiError('Invalid txHash: ScamVoteSubmitted event not found', '400');
    }

    let report;
    try {
      report = await ReportService.create({
        address,
        reporterAddress,
        threatType,
        severity,
        evidenceHash: evidenceHash || `manual-${Date.now()}`,
        explanation,
        transactionHash: txHash,
        confidence: typeof confidence === 'number' ? confidence : 60,
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
          reporterAddress: report.reporterAddress,
          threatType: report.threatType,
          severity: report.severity,
          riskLevel: report.riskLevel,
          explanation: report.explanation,
          status: report.status,
          confidence: report.confidence,
          transactionHash: report.transactionHash,
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
