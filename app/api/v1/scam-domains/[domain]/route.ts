// GET /api/v1/scam-domains/[domain] - Get a single scam domain record

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, errors } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain } = await params;

    if (!domain) {
      return apiError('Domain parameter is required', '400');
    }

    const normalizedDomain = decodeURIComponent(domain).trim().toLowerCase();

    const scamDomain = await prisma.scamDomain.findUnique({
      where: { domain: normalizedDomain },
    });

    if (!scamDomain) {
      return errors.notFound('Scam domain');
    }

    return apiSuccess({
      id: scamDomain.id,
      domain: scamDomain.domain,
      riskScore: scamDomain.riskScore,
      category: scamDomain.category,
      description: scamDomain.description,
      source: scamDomain.source,
      reportedBy: scamDomain.reportedBy,
      isActive: scamDomain.isActive,
      createdAt: scamDomain.createdAt,
      updatedAt: scamDomain.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching scam domain:', error);
    return apiError('Internal server error', '500');
  }
}
