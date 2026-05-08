import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isValidEthereumAddress } from "@/lib/address-validation"

/**
 * GET /api/v1/extension/settings?walletAddress=0x...
 * Get user settings for extension (no API keys exposed)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json({ error: "Missing walletAddress" }, { status: 400 })
    }

    if (!isValidEthereumAddress(walletAddress)) {
      return NextResponse.json({ error: "Invalid walletAddress format" }, { status: 400 })
    }

    const settings = await prisma.userSettings.findUnique({
      where: { address: walletAddress.toLowerCase() }
    })

    // Return safe info (no API keys exposed to extension)
    return NextResponse.json({
      walletAddress,
      aiProvider: settings?.aiProvider || "default",
      hasCustomProvider: !!settings && settings.aiProvider !== "default",
      aiModel: settings?.aiModel || null,
      // Mask API key - only show if configured
      hasApiKey: !!settings?.aiApiKey,
    })
  } catch (error) {
    console.error("Extension settings error:", error)
    return NextResponse.json({ error: "Failed to get settings" }, { status: 500 })
  }
}
