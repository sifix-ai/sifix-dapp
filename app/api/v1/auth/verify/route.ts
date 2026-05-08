import { NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"
import { consumeNonce } from "@/lib/nonce-store"
import { isValidEthereumAddress } from "@/lib/address-validation"

/**
 * POST /api/v1/auth/verify
 * Verify wallet signature and issue API token
 * Body: { walletAddress, signature, message }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, signature, message } = body

    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        { error: "Missing required fields: walletAddress, signature, message" },
        { status: 400 }
      )
    }

    if (!isValidEthereumAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid walletAddress format" },
        { status: 400 }
      )
    }

    // Verify that a valid nonce was issued for this wallet
    const nonceEntry = consumeNonce(walletAddress)
    if (!nonceEntry) {
      return NextResponse.json(
        { error: "No valid nonce found. Request a new nonce first." },
        { status: 401 }
      )
    }

    // Verify the nonce appears in the signed message (replay protection)
    if (!message.includes(nonceEntry.nonce)) {
      return NextResponse.json(
        { error: "Nonce mismatch in signed message" },
        { status: 401 }
      )
    }

    // Verify signature — ethers v6
    const recoveredAddress = ethers.verifyMessage(message, signature)

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json(
        { error: "Signature does not match wallet address" },
        { status: 401 }
      )
    }

    // Generate API token
    const token = `sfx_${randomBytes(32).toString("hex")}`
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    // Deactivate any existing sessions for this wallet
    await prisma.extensionSession.updateMany({
      where: {
        walletAddress: walletAddress.toLowerCase(),
        isActive: true,
      },
      data: { isActive: false },
    })

    // Create new session
    const session = await prisma.extensionSession.create({
      data: {
        walletAddress: walletAddress.toLowerCase(),
        token,
        expiresAt,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    })

    console.log(`[Auth] Token issued for ${walletAddress} (expires: ${expiresAt.toISOString()})`)

    return NextResponse.json({
      success: true,
      token: session.token,
      walletAddress: session.walletAddress,
      expiresAt: session.expiresAt.toISOString(),
    })
  } catch (error) {
    console.error("[Auth] Verify error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}
