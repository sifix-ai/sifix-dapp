import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { isValidEthereumAddress } from "@/lib/address-validation"
import { setNonce } from "@/lib/nonce-store"

/**
 * GET /api/v1/auth/nonce?walletAddress=0x...
 * Generate a nonce for the wallet to sign
 */
export async function GET(request: NextRequest) {
  const walletAddress = request.nextUrl.searchParams.get("walletAddress")

  if (!walletAddress || !isValidEthereumAddress(walletAddress)) {
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

  // Store nonce via shared store (lowercase key for case-insensitive lookup)
  setNonce(walletAddress, nonce, timestamp)

  return NextResponse.json({ nonce, message, timestamp })
}
