// GET /api/v1/address/:address - Get address reputation

import { NextRequest } from 'next/server';
import { AddressService } from '@/services/address-service';
import { apiSuccess, apiError, errors } from '@/lib/api-response';
import { isValidEthereumAddress } from '@/lib/address-validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address || !isValidEthereumAddress(address)) {
      return errors.invalidAddress();
    }

    const data = await AddressService.getDetails(address);

    if (!data) {
      return errors.addressNotFound(address);
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
