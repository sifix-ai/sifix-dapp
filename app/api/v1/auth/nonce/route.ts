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
  const issuedAt = new Date()
  const expirationTime = new Date(issuedAt.getTime() + 5 * 60 * 1000)
  const domain = request.nextUrl.hostname
  const origin = request.nextUrl.origin
  const chainId = request.nextUrl.searchParams.get("chainId") || "16601"

  const message = [
    `${domain} wants you to sign in with your Ethereum account:`,
    walletAddress,
    "",
    "Authenticate SIFIX Extension to enable transaction protection.",
    "No gas or token transfer will occur.",
    "",
    `URI: ${origin}`,
    "Version: 1",
    `Chain ID: ${chainId}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt.toISOString()}`,
    `Expiration Time: ${expirationTime.toISOString()}`,
    "Resources:",
    "- https://sifix.io/extension",
  ].join("\n")

  const timestamp = issuedAt.getTime()

  // Store nonce via shared store (lowercase key for case-insensitive lookup)
  setNonce(walletAddress, nonce, timestamp)

  return NextResponse.json({ nonce, message, timestamp })
}
