import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-response'

const applySchema = z.object({
  protocolName: z.string().min(1, 'Protocol name is required').max(100),
  website: z.string().url('Must be a valid URL'),
  contactEmail: z.string().email('Must be a valid email'),
  useCase: z.enum([
    'DEX_INTEGRATION',
    'LENDING_PROTOCOL',
    'WALLET',
    'INSURANCE',
    'BRIDGE',
    'OTHER',
  ]),
  requestedTier: z.enum(['BASIC', 'PRO', 'ENTERPRISE']),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = applySchema.parse(body)

    const application = await prisma.protocol_applications.create({
      data: {
        protocolName: data.protocolName,
        website: data.website,
        contactEmail: data.contactEmail,
        useCase: data.useCase,
        requestedTier: data.requestedTier,
      },
    })

    return apiSuccess({ id: application.id, status: application.status })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError(error.errors[0]?.message ?? 'Invalid input', '400')
    }
    return apiError('Failed to submit application', '500')
  }
}
