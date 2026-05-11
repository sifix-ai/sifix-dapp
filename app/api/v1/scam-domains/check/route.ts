/**
 * Consolidated Domain Check API
 * GET /api/v1/scam-domains/check?domain=example.com&lightweight=true
 *
 * Checks if a domain is a known scam with optional lightweight mode.
 * 
 * Query Parameters:
 *  - domain (required): The domain to check
 *  - lightweight (optional): If true, returns minimal response { isScam, riskScore }
 *
 * Response:
 *  - Lightweight: { isScam, riskScore }
 *  - Full: { domain, isScam, matchType, riskScore, category, source, ... }
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

// Type for lightweight response
interface LightweightResponse {
  isScam: boolean;
  riskScore: number;
}

// Type for full response
interface FullResponse {
  domain: string;
  isScam: boolean;
  matchType: 'exact' | 'partial' | null;
  riskScore: number;
  category?: string;
  source?: string;
  description?: string;
  isActive?: boolean;
  queriedDomain?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const lightweight = searchParams.get('lightweight') === 'true';

    if (!domain || typeof domain !== 'string' || domain.trim().length === 0) {
      return apiError('Domain query parameter is required', '400');
    }

    // Clean up domain (remove protocol, www, path)
    const normalizedDomain = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0];

    // Exact match lookup
    const exactMatch = await prisma.scamDomain.findUnique({
      where: { domain: normalizedDomain },
    });

    if (exactMatch) {
      if (lightweight) {
        return apiSuccess<LightweightResponse>({
          isScam: true,
          riskScore: exactMatch.riskScore,
        });
      }

      return apiSuccess<FullResponse>({
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
    const parts = normalizedDomain.split('.');
    if (parts.length > 1) {
      const parentDomain = parts.slice(1).join('.');
      const partialMatches = await prisma.scamDomain.findMany({
        where: {
          isActive: true,
          domain: parentDomain,
        },
        take: 1,
      });

      if (partialMatches.length > 0) {
        const match = partialMatches[0];
        if (lightweight) {
          return apiSuccess<LightweightResponse>({
            isScam: true,
            riskScore: match.riskScore,
          });
        }

        return apiSuccess<FullResponse>({
          isScam: true,
          matchType: 'partial',
          domain: match.domain,
          queriedDomain: normalizedDomain,
          riskScore: match.riskScore,
          category: match.category,
          source: match.source,
          description: match.description,
          isActive: match.isActive,
        });
      }
    }

    // No match found
    if (lightweight) {
      return apiSuccess<LightweightResponse>({
        isScam: false,
        riskScore: 0,
      });
    }

    return apiSuccess<FullResponse>({
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
