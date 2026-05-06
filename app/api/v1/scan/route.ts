// POST /api/v1/scan - Scan transaction

import { NextRequest, NextResponse } from 'next/server';
import { ScannerService } from '@/services/scanner-service';
import { apiResponse, apiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { from, to, value, data, userAddress } = body;

    // Validation
    if (!from || !/^0x[a-fA-F0-9]{40}$/.test(from)) {
      return apiError('Invalid from address', 400);
    }

    if (!to || !/^0x[a-fA-F0-9]{40}$/.test(to)) {
      return apiError('Invalid to address', 400);
    }

    // Scan transaction (already saves internally)
    const result = await ScannerService.scanTransaction({
      from,
      to,
      value,
      data,
      userAddress,
    });

    return apiResponse({
      from,
      to,
      ...result,
    });
  } catch (error) {
    console.error('Error scanning transaction:', error);
    return apiError('Internal server error', 500);
  }
}
