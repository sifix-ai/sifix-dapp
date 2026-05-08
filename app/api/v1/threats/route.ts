// GET /api/v1/threats - List threat reports
// POST /api/v1/threats - Submit new threat report

import { NextRequest, NextResponse } from 'next/server';
import { ReportService } from '@/services/report-service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { isValidEthereumAddress } from '@/lib/address-validation';

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

    const filters = {
      status: searchParams.get('status') as any,
      threatType: searchParams.get('threatType') as any,
      riskLevel: searchParams.get('riskLevel') as any,
      reporterAddress,
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
      address,
      reporterAddress,
      threatType,
      severity,
      evidenceHash,
      explanation,
      transactionHash,
      confidence,
      simulationData,
    } = body;

    // Validate addresses
    if (!address || !isValidEthereumAddress(address)) {
      return apiError('Invalid address format', '400');
    }

    if (!reporterAddress || !isValidEthereumAddress(reporterAddress)) {
      return apiError('Invalid reporter address format', '400');
    }

    if (!threatType || !severity || !evidenceHash || !explanation || !confidence) {
      return apiError('Missing required fields', '400');
    }

    const report = await ReportService.create({
      address,
      reporterAddress,
      threatType,
      severity,
      evidenceHash,
      explanation,
      transactionHash,
      confidence,
      simulationData,
    });

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
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating report:', error);
    return apiError('Internal server error', '500');
  }
}
