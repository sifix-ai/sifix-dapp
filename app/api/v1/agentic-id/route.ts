import { NextRequest, NextResponse } from 'next/server'
import type { Address } from 'viem'
import {
  AGENTIC_ID_CONTRACT_ADDRESS,
  AGENTIC_ID_TOKEN_ID,
  AGENTIC_ID_ABI,
} from '@/config/contracts'
import { apiSuccess, errors, withErrorHandler } from '@/lib/api-response'
import { isAuthorizedForSifixAgent, authorizeUserServerSide, getMintFee, getConfiguredAgenticTokenId, isTokenOwner } from '@/lib/agentic-id'
import { readFullAgentProfile } from '@/lib/agentic-id-client'
import { isValidEthereumAddress } from '@/lib/address-validation'
import { verifyApiAuth } from '@/lib/extension-auth'

export const GET = withErrorHandler(async () => {
  const tokenId = getConfiguredAgenticTokenId()
  let mintFee: bigint | null = null
  let profile = null
  try { mintFee = await getMintFee() } catch {}
  if (tokenId) {
    try { profile = await readFullAgentProfile(tokenId) } catch {}
  }
  return apiSuccess({
    contractAddress: AGENTIC_ID_CONTRACT_ADDRESS,
    tokenId: tokenId ? tokenId.toString() : null,
    abi: AGENTIC_ID_ABI,
    mintFee: mintFee ? mintFee.toString() : null,
    profile,
  })
})

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json()
  const { action, user, tokenId: bodyTokenId } = body as {
    action: 'check' | 'authorize'
    user?: string
    tokenId?: string
  }

  if (action === 'check') {
    // Keep check flow usable for wallets without Agentic-ID access.
    // Require valid session, but do NOT enforce Agentic-ID authorization here.
    const auth = await verifyApiAuth({ enforceAgenticAuthorization: false })
    if (!auth.authorized) {
      return errors.unauthorized(auth.error)
    }

    if (!user) return errors.validation('Missing field: user')
    if (!isValidEthereumAddress(user)) return errors.invalidAddress()
    const result = await isAuthorizedForSifixAgent(user as Address)
    return apiSuccess(result)
  }
  if (action === 'authorize') {
    const auth = await verifyApiAuth()
    if (!auth.authorized) {
      return errors.unauthorized(auth.error)
    }
    const tokenId = bodyTokenId
      ? BigInt(bodyTokenId)
      : getConfiguredAgenticTokenId()
    if (!tokenId) return errors.validation('tokenId is required (no default configured)')
    if (!user) return errors.validation('Missing field: user')
    if (!isValidEthereumAddress(user)) return errors.invalidAddress()

    // Owner-only check: only the token owner can authorize users
    const authenticatedWallet = (auth.walletAddress ?? '').toLowerCase() as Address
    const isOwner = await isTokenOwner(tokenId, authenticatedWallet)
    if (!isOwner) {
      return errors.forbidden('Only the token owner can authorize users')
    }

    const result = await authorizeUserServerSide({
      tokenId,
      user: user as Address,
    })
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
    return apiSuccess({ txHash: result.txHash })
  }
  return errors.validation('Invalid action. Use "check" or "authorize"')
})
