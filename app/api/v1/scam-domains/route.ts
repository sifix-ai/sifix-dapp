// GET  /api/v1/scam-domains - List scam domains with filters
// POST /api/v1/scam-domains - Report a new scam domain

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, errors } from '@/lib/api-response';
import { verifyApiAuth } from '@/lib/extension-auth';
import { isValidEthereumAddress } from '@/lib/address-validation';

/** Maximum number of scam domain records a client may request per page */
const MAX_SCAM_DOMAINS_LIMIT = 100;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawLimit = parseInt(searchParams.get('limit') || '50');
    const limit = Math.min(Math.max(rawLimit, 1), MAX_SCAM_DOMAINS_LIMIT);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

    // Build where clause from filters
    const where: any = {};

    const category = searchParams.get('category');
    if (category) {
      where.category = category.toUpperCase();
    }

    const source = searchParams.get('source');
    if (source) {
      where.source = source.toUpperCase();
    }

    const isActive = searchParams.get('active');
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    } else {
      // Default to active only
      where.isActive = true;
    }

    const minRiskScore = searchParams.get('minRiskScore');
    if (minRiskScore) {
      where.riskScore = { gte: parseInt(minRiskScore) };
    }

    const search = searchParams.get('search');
    if (search) {
      where.domain = { contains: search.toLowerCase() };
    }

    const [domains, total] = await Promise.all([
      prisma.scamDomain.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.scamDomain.count({ where }),
    ]);

    return apiSuccess({
      domains: domains.map((d) => ({
        id: d.id,
        domain: d.domain,
        riskScore: d.riskScore,
        category: d.category,
        description: d.description,
        source: d.source,
        reportedBy: d.reportedBy,
        isActive: d.isActive,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
      total,
    });
  } catch (error) {
    console.error('Error fetching scam domains:', error);
    return apiError('Internal server error', '500');
  }
}

export async function POST(request: NextRequest) {
  // Auth check
  const auth = await verifyApiAuth();
  if (!auth.authorized) {
    return errors.unauthorized(auth.error || 'Unauthorized');
  }

  try {
    const body = await request.json();
    const { domain, riskScore, category, description, source } = body;

    // Validate required fields
    if (!domain || typeof domain !== 'string' || domain.trim().length === 0) {
      return apiError('Domain is required', '400');
    }

    // Normalize domain
    const normalizedDomain = domain.trim().toLowerCase();

    // Basic domain format validation
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(normalizedDomain)) {
      return apiError('Invalid domain format', '400');
    }

    // Validate optional fields
    const validCategories = ['PHISHING', 'MALWARE', 'SCAM', 'RUGPULL', 'FAKE_AIRDROP'];
    if (category && !validCategories.includes(category.toUpperCase())) {
      return apiError(`Invalid category. Must be one of: ${validCategories.join(', ')}`, '400');
    }

    const validSources = ['COMMUNITY', 'AUTOMATED', 'MANUAL', 'GOPUS'];
    if (source && !validSources.includes(source.toUpperCase())) {
      return apiError(`Invalid source. Must be one of: ${validSources.join(', ')}`, '400');
    }

    if (riskScore !== undefined && (typeof riskScore !== 'number' || riskScore < 0 || riskScore > 100)) {
      return apiError('Risk score must be a number between 0 and 100', '400');
    }

    // Check if domain already exists
    const existing = await prisma.scamDomain.findUnique({
      where: { domain: normalizedDomain },
    });

    if (existing) {
      return apiError('Domain already reported', '409');
    }

    // Create the scam domain record
    const scamDomain = await prisma.scamDomain.create({
      data: {
        domain: normalizedDomain,
        riskScore: riskScore ?? 80,
        category: category?.toUpperCase() ?? 'PHISHING',
        description: description ?? null,
        source: source?.toUpperCase() ?? 'COMMUNITY',
        reportedBy: auth.walletAddress ?? null,
        isActive: true,
      },
    });

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
    });
  } catch (error) {
    console.error('Error creating scam domain:', error);
    return apiError('Internal server error', '500');
  }
}
