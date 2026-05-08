import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"

// In-memory nonce store (ephemeral, resets on server restart)
// For production, use Redis or DB — but this is fine for hackathon
const nonceStore = new Map<string, { nonce: string; createdAt: number }>()

// Clean up old nonces every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of nonceStore.entries()) {
    if (now - val.createdAt > 5 * 60 * 1000) {
      nonceStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * GET /api/v1/auth/nonce?walletAddress=0x...
 * Generate a nonce for the wallet to sign
 */
export async function GET(request: NextRequest) {
  const walletAddress = request.nextUrl.searchParams.get("walletAddress")

  if (!walletAddress || !walletAddress.startsWith("0x")) {
    return NextResponse.json({ error: "Valid walletAddress required" }, { status: 400 })
  }

  const nonce = randomUUID()
  const timestamp = Date.now()

  const message = [
    "SIFIX Extension Authentication",
    "",
    "Sign this message to verify your wallet ownership.",
    "This does not cost any gas or tokens.",
    "",
    `Wallet: ${walletAddress}`,
    `Nonce: ${nonce}`,
    `Timestamp: ${timestamp}`,
    `Expires: 5 minutes`,
  ].join("\n")

  // Store nonce (lowercase key for case-insensitive lookup)
  nonceStore.set(walletAddress.toLowerCase(), { nonce, createdAt: timestamp })

  return NextResponse.json({ nonce, message, timestamp })
}
