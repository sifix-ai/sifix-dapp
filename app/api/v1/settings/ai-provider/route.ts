import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { apiSuccess, errors, withErrorHandler } from "@/lib/api-response"
import { isValidEthereumAddress } from "@/lib/address-validation"

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
 * Strip sensitive fields (aiApiKey) from a settings object before returning it.
 */
function sanitizeSettings<T extends Record<string, unknown>>(settings: T): Omit<T, 'aiApiKey'> & { hasApiKey: boolean } {
  const { aiApiKey, ...rest } = settings
  return {
    ...rest,
    hasApiKey: !!aiApiKey,
  }
}

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

    if (!isValidEthereumAddress(address)) {
      return errors.invalidAddress()
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

    // Strip aiApiKey before sending to client
    return apiSuccess(sanitizeSettings(settings))
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

    if (!isValidEthereumAddress(address)) {
      return errors.invalidAddress()
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

    // Strip aiApiKey before sending to client
    return apiSuccess(sanitizeSettings(settings))
  })
}

/**
 * DELETE /api/v1/settings/ai-provider?address=0x...
 * Reset AI provider settings to defaults for a given address
 */
export async function DELETE(request: NextRequest) {
  // Auth check
  const auth = await verifyApiAuth()
  if (!auth.authorized) {
    return errors.unauthorized(auth.error)
  }

  return withErrorHandler(async () => {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return errors.validation("Missing required query parameter: address")
    }

    if (!isValidEthereumAddress(address)) {
      return errors.invalidAddress()
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

    // Strip aiApiKey before sending to client
    return apiSuccess(sanitizeSettings(settings))
  })
}
