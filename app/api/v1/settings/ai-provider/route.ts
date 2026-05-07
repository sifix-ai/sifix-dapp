import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { apiSuccess, errors, withErrorHandler } from "@/lib/api-response"

// Valid AI provider values
const VALID_AI_PROVIDERS = [
  "default",
  "openai",
  "groq",
  "0g-compute",
  "ollama",
  "custom",
] as const

type AiProvider = (typeof VALID_AI_PROVIDERS)[number]

/**
 * GET /api/v1/settings/ai-provider?address=0x...
 * Retrieve AI provider settings for a given address
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return errors.validation("Missing required query parameter: address")
    }

    let settings = await prisma.userSettings.findUnique({
      where: { address },
    })

    // Auto-create default settings if none exist
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { address },
      })
    }

    return apiSuccess(settings)
  })
}

/**
 * PUT /api/v1/settings/ai-provider
 * Create or update AI provider settings for a given address
 *
 * Body: { address, aiProvider, aiApiKey?, aiBaseUrl?, aiModel? }
 */
export async function PUT(request: NextRequest) {
  return withErrorHandler(async () => {
    const body = await request.json()
    const { address, aiProvider, aiApiKey, aiBaseUrl, aiModel } = body

    // Validate required fields
    if (!address) {
      return errors.validation("Missing required field: address")
    }

    if (aiProvider && !VALID_AI_PROVIDERS.includes(aiProvider as AiProvider)) {
      return errors.validation(
        `Invalid aiProvider. Must be one of: ${VALID_AI_PROVIDERS.join(", ")}`,
        { validProviders: VALID_AI_PROVIDERS }
      )
    }

    // Build update data — only include fields that are explicitly provided
    const updateData: Record<string, unknown> = {}
    if (aiProvider !== undefined) updateData.aiProvider = aiProvider
    if (aiApiKey !== undefined) updateData.aiApiKey = aiApiKey || null
    if (aiBaseUrl !== undefined) updateData.aiBaseUrl = aiBaseUrl || null
    if (aiModel !== undefined) updateData.aiModel = aiModel || null

    // Upsert: create if not exists, update if exists
    const settings = await prisma.userSettings.upsert({
      where: { address },
      update: updateData,
      create: {
        address,
        ...(aiProvider && { aiProvider }),
        ...(aiApiKey && { aiApiKey }),
        ...(aiBaseUrl && { aiBaseUrl }),
        ...(aiModel && { aiModel }),
      },
    })

    return apiSuccess(settings)
  })
}

/**
 * DELETE /api/v1/settings/ai-provider?address=0x...
 * Reset AI provider settings to defaults for a given address
 */
export async function DELETE(request: NextRequest) {
  return withErrorHandler(async () => {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return errors.validation("Missing required query parameter: address")
    }

    // Reset to defaults instead of deleting the record entirely
    const settings = await prisma.userSettings.upsert({
      where: { address },
      update: {
        aiProvider: "default",
        aiApiKey: null,
        aiBaseUrl: null,
        aiModel: null,
      },
      create: {
        address,
      },
    })

    return apiSuccess(settings)
  })
}
