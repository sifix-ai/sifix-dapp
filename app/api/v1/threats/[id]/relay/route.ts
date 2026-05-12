import { NextResponse } from 'next/server'

/**
 * Legacy endpoint.
 * Flow moved to user-published tx (wallet signs/sends).
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'Legacy endpoint: use /api/v1/threats/:id/publish',
      code: 'LEGACY_ENDPOINT',
    },
    { status: 410 }
  )
}
