// GET  /api/v1/scam-domains/check - Check if a domain is a known scam

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain || typeof domain !== 'string' || domain.trim().length === 0) {
      return apiError('Domain query parameter is required', '400');
    }

    const normalizedDomain = domain.trim().toLowerCase();

    // Exact match lookup
    const exactMatch = await prisma.scamDomain.findUnique({
      where: { domain: normalizedDomain },
    });

    if (exactMatch) {
      return apiSuccess({
        isScam: true,
        matchType: 'exact',
        domain: exactMatch.domain,
        riskScore: exactMatch.riskScore,
        category: exactMatch.category,
        description: exactMatch.description,
        source: exactMatch.source,
        isActive: exactMatch.isActive,
      });
    }

    // Partial / subdomain match — check if the domain ends with a known scam domain
    // e.g. scam.example.com should match example.com
    const partialMatches = await prisma.scamDomain.findMany({
      where: {
        isActive: true,
        domain: { in: normalizedDomain.split('.').slice(1).join('.') ? [normalizedDomain.split('.').slice(1).join('.')] : [] },
      },
      take: 5,
    });

    if (partialMatches.length > 0) {
      const match = partialMatches[0];
      return apiSuccess({
        isScam: true,
        matchType: 'partial',
        domain: match.domain,
        queriedDomain: normalizedDomain,
        riskScore: match.riskScore,
        category: match.category,
        description: match.description,
        source: match.source,
        isActive: match.isActive,
      });
    }

    // No match found
    return apiSuccess({
      isScam: false,
      matchType: null,
      domain: normalizedDomain,
      riskScore: 0,
    });
  } catch (error) {
    console.error('Error checking scam domain:', error);
    return apiError('Internal server error', '500');
  }
}
