// GET /api/v1/address/:address - Get address reputation

import { NextRequest, NextResponse } from 'next/server';
import { AddressService } from '@/services/address-service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return apiError('Invalid address format', '400');
    }

    const data = await AddressService.getDetails(address);

    if (!data) {
      return apiError('Address not found', '404');
    }

    return apiSuccess({
      address: data.address,
      chain: data.chain,
      addressType: data.addressType,
      riskScore: data.riskScore,
      riskLevel: data.riskLevel,
      totalReports: data.totalReports,
      reports: data.reports.map((r) => ({
        id: r.id,
        threatType: r.threatType,
        severity: r.severity,
        riskLevel: r.riskLevel,
        explanation: r.explanation,
        status: r.status,
        createdAt: r.createdAt,
      })),
      reputation: data.reputation,
      firstSeenAt: data.firstSeenAt,
      lastSeenAt: data.lastSeenAt,
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    return apiError('Internal server error', '500');
  }
}
