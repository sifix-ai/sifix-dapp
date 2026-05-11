import { NextRequest, NextResponse } from "next/server"

/**
 * DEPRECATED — POST /api/v1/extension/scan
 *
 * This endpoint is deprecated and will be removed in a future version.
 * Use POST /api/v1/scan instead (same auth, same response, richer data).
 *
 * For now this handler proxies to the unified scan logic so existing
 * extension clients continue to work without changes.
 */

export async function POST(request: NextRequest) {
  console.warn(
    "[DEPRECATED] /api/v1/extension/scan called — migrate to /api/v1/scan"
  )

  // Dynamic import avoids circular re-export issues and keeps the
  // proxy thin — all business logic lives in the canonical route.
  const { POST: scanPost } = await import("@/app/api/v1/scan/route")

  return scanPost(request)
}

export async function GET(request: NextRequest) {
  console.warn(
    "[DEPRECATED] /api/v1/extension/scan (GET) called — migrate to /api/v1/scan"
  )

  const { GET: scanGet } = await import("@/app/api/v1/scan/route")

  return scanGet(request)
}
