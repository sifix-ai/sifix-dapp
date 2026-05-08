import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { isAuthorizedForSifixAgent } from "@/lib/agentic-id"

/**
 * Verify extension auth token from Authorization header
 * Used by all /api/v1/extension/* routes
 */
export async function verifyExtensionAuth(): Promise<{
  authorized: boolean
  walletAddress?: string
  agenticId?: {
    enabled: boolean
    authorized: boolean
    tokenId?: string
    reason?: string
  }
  error?: string
}> {
  try {
    const headersList = await headers()
    const authHeader = headersList.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { authorized: false, error: "Missing authorization token" }
    }

    const token = authHeader.replace("Bearer ", "")

    const session = await prisma.extensionSession.findFirst({
      where: {
        token,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
    })

    if (!session) {
      return { authorized: false, error: "Invalid or expired token" }
    }

    // Update lastUsedAt
    await prisma.extensionSession.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    })

    // Optional Agentic ID authorization guard
    const agenticId = await isAuthorizedForSifixAgent(
      session.walletAddress as `0x${string}`
    )

    if (agenticId.enabled && !agenticId.authorized) {
      return {
        authorized: false,
        walletAddress: session.walletAddress,
        agenticId,
        error: `Agentic ID authorization required (token #${agenticId.tokenId})`,
      }
    }

    return { authorized: true, walletAddress: session.walletAddress, agenticId }
  } catch (error) {
    console.error("[Auth] Verification error:", error)
    return { authorized: false, error: "Auth verification failed" }
  }
}
