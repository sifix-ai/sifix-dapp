import { NextRequest, NextResponse } from "next/server"

/**
 * DEPRECATED: /api/v1/extension/analyze
 * 
 * This endpoint has been merged into /api/v1/analyze
 * Both endpoints now support:
 * - Transaction analysis: { from, to, data, value }
 * - Message signature analysis: { from, method, data, typedData? }
 * 
 * This route now acts as a proxy/redirect handler with deprecation logging.
 */
export async function POST(request: NextRequest) {
  const body = await request.json()

  // Log deprecation warning
  console.warn(
    "[DEPRECATION] /api/v1/extension/analyze is deprecated. Please use /api/v1/analyze instead. " +
      `Request from: ${body.from}`
  )

  // Forward request to unified endpoint
  try {
    const response = await fetch(`${request.nextUrl.origin}/api/v1/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    // Add deprecation warning to response
    return NextResponse.json(
      {
        ...data,
        _deprecation: {
          message: "This endpoint (/api/v1/extension/analyze) is deprecated",
          alternative: "Use /api/v1/analyze instead",
          removedIn: "v2.0.0",
        },
      },
      { status: response.status }
    )
  } catch (error) {
    console.error("[Deprecation Proxy] Failed to forward request:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
