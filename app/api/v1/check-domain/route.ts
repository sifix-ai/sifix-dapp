/**
 * Domain Check API (DEPRECATED)
 * GET /api/v1/check-domain?domain=example.com
 *
 * ⚠️ DEPRECATED: Use /api/v1/scam-domains/check instead
 *
 * This endpoint is maintained for backward compatibility but will be removed in v2.
 * All requests are proxied to /scam-domains/check with lightweight=true.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const domain = request.nextUrl.searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: '400',
            message: 'Domain parameter is required',
          },
        },
        { status: 400 }
      );
    }

    // Log deprecation warning
    console.warn(
      '[DEPRECATION] GET /api/v1/check-domain is deprecated. Use /api/v1/scam-domains/check instead.',
      { domain }
    );

    // Redirect to the consolidated endpoint with lightweight=true
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = '/api/v1/scam-domains/check';
    redirectUrl.searchParams.set('domain', domain);
    redirectUrl.searchParams.set('lightweight', 'true');

    const response = await fetch(redirectUrl.toString(), {
      method: 'GET',
    });

    const data = await response.json();

    // Transform lightweight response to legacy format for backward compatibility
    if (data.success && data.data) {
      const legacyResponse = {
        success: true,
        data: {
          domain: domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0],
          isScam: data.data.isScam,
          riskScore: data.data.riskScore,
          riskLevel:
            data.data.riskScore >= 80
              ? 'CRITICAL'
              : data.data.riskScore >= 60
                ? 'HIGH'
                : data.data.riskScore >= 40
                  ? 'MEDIUM'
                  : data.data.riskScore >= 20
                    ? 'LOW'
                    : 'SAFE',
          category: 'UNKNOWN',
          checkedAt: new Date().toISOString(),
        },
      };
      return NextResponse.json(legacyResponse);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Check domain error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: '500',
          message: 'Internal server error',
        },
      },
      { status: 500 }
    );
  }
}
