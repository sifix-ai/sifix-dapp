import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Valid AI provider values
const VALID_AI_PROVIDERS = [
  "default",
  "openai",
  "groq",
  "0g-compute",
  "ollama",
  "custom",
] as const

// Locked default profile — always maps to 0G Compute
const DEFAULT_LOCKED_PROVIDER = "0g-compute"
const DEFAULT_LOCKED_MODEL = "qwen-2.5-7b-instruct"

type AiProvider = (typeof VALID_AI_PROVIDERS)[number]

function isValidEth(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr)
}

function sanitize<T extends Record<string, unknown>>(settings: T) {
  const { aiApiKey, ...rest } = settings
  return { ...rest, hasApiKey: !!aiApiKey }
}

function lockedResponse(settings: Record<string, unknown>) {
  return {
    ...sanitize(settings),
    effectiveProvider: DEFAULT_LOCKED_PROVIDER,
    aiModel: DEFAULT_LOCKED_MODEL,
    aiBaseUrl: process.env.COMPUTE_PROVIDER_ADDRESS || settings.aiBaseUrl || null,
    isLocked: true,
  }
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

function errRes(message: string, status = 400, code = "VALIDATION_ERROR") {
  return json({ success: false, error: { code, message } }, status)
}

/**
 * GET /api/v1/settings/ai-provider?address=0x...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) return errRes("Missing required query parameter: address")
    if (!isValidEth(address)) return errRes("Invalid Ethereum address format", 400, "INVALID_ADDRESS")

    const addr = address.toLowerCase()

    let settings = await prisma.userSettings.findUnique({ where: { address: addr } })

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { address: addr, aiProvider: "default", aiModel: DEFAULT_LOCKED_MODEL, },
      })
    }

    if (settings.aiProvider === "default") {
      return json({ success: true, data: lockedResponse(settings) })
    }

    return json({ success: true, data: sanitize(settings) })
  } catch (error: unknown) {
    console.error("[settings/ai-provider GET]", error)
    const msg = error instanceof Error ? error.message : "Internal server error"
    return errRes(msg, 500, "INTERNAL_ERROR")
  }
}

/**
 * PUT /api/v1/settings/ai-provider
 * Body: { address, aiProvider, aiApiKey?, aiBaseUrl?, aiModel? }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, aiProvider, aiApiKey, aiBaseUrl, aiModel } = body

    if (!address) return errRes("Missing required field: address")
    if (!isValidEth(address)) return errRes("Invalid Ethereum address format", 400, "INVALID_ADDRESS")

    if (aiProvider && !VALID_AI_PROVIDERS.includes(aiProvider as AiProvider)) {
      return errRes(`Invalid aiProvider. Must be one of: ${VALID_AI_PROVIDERS.join(", ")}`)
    }

    const addr = address.toLowerCase()
    const provider = aiProvider || "default"

    // "default" / "0g-compute" → locked profile
    if (provider === "default" || provider === "0g-compute") {
      const settings = await prisma.userSettings.upsert({
        where: { address: addr },
        update: {
          aiProvider: "default",
          aiApiKey: null,
          aiBaseUrl: process.env.COMPUTE_PROVIDER_ADDRESS || null,
          aiModel: DEFAULT_LOCKED_MODEL,
        },
        create: {
          address: addr,
          aiProvider: "default",
          aiApiKey: null,
          aiBaseUrl: process.env.COMPUTE_PROVIDER_ADDRESS || null,
          aiModel: DEFAULT_LOCKED_MODEL,
        },
      })
      return json({ success: true, data: lockedResponse(settings) })
    }

    // Non-locked provider
    const updateData: Record<string, unknown> = {}
    if (aiProvider !== undefined) updateData.aiProvider = aiProvider
    if (aiApiKey !== undefined) updateData.aiApiKey = aiApiKey || null
    if (aiBaseUrl !== undefined) updateData.aiBaseUrl = aiBaseUrl || null
    if (aiModel !== undefined) updateData.aiModel = aiModel || null

    const settings = await prisma.userSettings.upsert({
      where: { address: addr },
      update: updateData,
      create: {
        address: addr,
        ...(aiProvider && { aiProvider }),
        ...(aiApiKey && { aiApiKey }),
        ...(aiBaseUrl && { aiBaseUrl }),
        ...(aiModel && { aiModel }),
      },
    })

    return json({ success: true, data: sanitize(settings) })
  } catch (error: unknown) {
    console.error("[settings/ai-provider PUT]", error)
    const msg = error instanceof Error ? error.message : "Internal server error"
    return errRes(msg, 500, "INTERNAL_ERROR")
  }
}

/**
 * DELETE /api/v1/settings/ai-provider?address=0x...
 * Reset to locked defaults.
 */
export async function DELETE(request: NextRequest) {
  try {
    // Lazy import — avoid loading extension-auth (+ viem chain) at module level
    const { verifyApiAuth } = await import("@/lib/extension-auth")
    const auth = await verifyApiAuth()
    if (!auth.authorized) {
      return errRes(auth.error || "Unauthorized", 401, "UNAUTHORIZED")
    }

    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) return errRes("Missing required query parameter: address")
    if (!isValidEth(address)) return errRes("Invalid Ethereum address format", 400, "INVALID_ADDRESS")

    const addr = address.toLowerCase()

    const settings = await prisma.userSettings.upsert({
      where: { address: addr },
      update: {
        aiProvider: "default",
        aiApiKey: null,
        aiBaseUrl: process.env.COMPUTE_PROVIDER_ADDRESS || null,
        aiModel: DEFAULT_LOCKED_MODEL,
      },
      create: {
        address: addr,
        aiProvider: "default",
        aiApiKey: null,
        aiBaseUrl: process.env.COMPUTE_PROVIDER_ADDRESS || null,
        aiModel: DEFAULT_LOCKED_MODEL,
      },
    })

    return json({ success: true, data: lockedResponse(settings) })
  } catch (error: unknown) {
    console.error("[settings/ai-provider DELETE]", error)
    const msg = error instanceof Error ? error.message : "Internal server error"
    return errRes(msg, 500, "INTERNAL_ERROR")
  }
}
