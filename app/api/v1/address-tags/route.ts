/**
 * Address Tags API (Deprecated)
 * 
 * DEPRECATED: This endpoint is being consolidated into /api/v1/address/[address]/tags
 * 
 * This file serves as a proxy to the new unified endpoint:
 * - GET /api/v1/address-tags?address=0x... → GET /api/v1/address/0x.../tags
 * - POST /api/v1/address-tags → POST /api/v1/address/[address]/tags
 * 
 * All requests are forwarded to the new endpoint structure.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Deprecation notice logger
 */
function logDeprecation(method: string, queryParams: Record<string, any>) {
  console.warn(
    '[DEPRECATED] /api/v1/address-tags endpoint called',
    {
      method,
      queryParams,
      timestamp: new Date().toISOString(),
      message: 'Use /api/v1/address/[address]/tags instead',
    }
  );
}

/**
 * GET — List address tags (deprecated)
 * Forwards to /api/v1/address/[address]/tags
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    logDeprecation('GET', Object.fromEntries(searchParams));

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Build new URL for the consolidated endpoint
    const newPath = `/api/v1/address/${address}/tags`;
    
    // Preserve pagination and sort params
    const newParams = new URLSearchParams();
    const limit = searchParams.get('limit') || searchParams.get('page') ? searchParams.get('limit') || '20' : '20';
    const offset = searchParams.get('offset');
    const sort = searchParams.get('sort');
    
    newParams.set('limit', limit);
    if (offset) newParams.set('offset', offset);
    if (sort) newParams.set('sort', sort);

    const newUrl = `${newPath}?${newParams.toString()}`;
    
    // Forward the request
    const forwardedRequest = new NextRequest(
      new URL(newUrl, request.url),
      {
        method: 'GET',
        headers: request.headers,
      }
    );

    const response = await fetch(forwardedRequest);
    return response;
  } catch (error) {
    console.error('Address tags proxy error (GET):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST — Create address tag (deprecated)
 * Forwards to /api/v1/address/[address]/tags
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    logDeprecation('POST', { address });

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required in request body' },
        { status: 400 }
      );
    }

    // Build new URL for the consolidated endpoint
    const newPath = `/api/v1/address/${address}/tags`;
    
    // Forward the request with only the tag data
    const forwardedRequest = new NextRequest(
      new URL(newPath, request.url),
      {
        method: 'POST',
        headers: request.headers,
        body: JSON.stringify({ tag: body.tag }),
      }
    );

    const response = await fetch(forwardedRequest);
    return response;
  } catch (error) {
    console.error('Address tags proxy error (POST):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
