import { NextResponse } from "next/server"
import { verifyExtensionAuth } from "@/lib/extension-auth"

/**
 * GET /api/v1/auth/verify-token
 * Check if the current Bearer token is valid
 */
export async function GET() {
  const auth = await verifyExtensionAuth()

  if (!auth.authorized) {
    return NextResponse.json(
      { valid: false, error: auth.error },
      { status: 401 }
    )
  }

  return NextResponse.json({
    valid: true,
    walletAddress: auth.walletAddress,
  })
}
