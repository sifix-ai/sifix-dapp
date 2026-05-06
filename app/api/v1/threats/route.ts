// GET /api/v1/threats - List threat reports
// POST /api/v1/report - Submit new threat report

import { NextRequest, NextResponse } from 'next/server';
import { ReportService } from '@/services/report-service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      status: searchParams.get('status') as any,
      threatType: searchParams.get('threatType') as any,
      riskLevel: searchParams.get('riskLevel') as any,
      reporterAddress: searchParams.get('reporter') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
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

    // Validation
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return apiError('Invalid address format', '400');
    }

    if (!reporterAddress || !/^0x[a-fA-F0-9]{40}$/.test(reporterAddress)) {
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
