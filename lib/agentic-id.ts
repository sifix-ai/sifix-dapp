import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  keccak256,
  stringToHex,
  type Address,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  AGENTIC_ID_ABI,
  AGENTIC_ID_CONTRACT_ADDRESS,
  AGENTIC_ID_TOKEN_ID,
} from '@/config/contracts'

const zgChain = defineChain({
  id: 16602,
  name: '0G Galileo Testnet',
  network: '0g-galileo-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'A0GI',
    symbol: 'A0GI',
  },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_ZG_RPC_URL || 'https://evmrpc-testnet.0g.ai'] },
    public: { http: [process.env.NEXT_PUBLIC_ZG_RPC_URL || 'https://evmrpc-testnet.0g.ai'] },
  },
  blockExplorers: {
    default: { name: '0G Chain Explorer', url: 'https://chainscan-galileo.0g.ai' },
  },
})

const publicClient = createPublicClient({
  chain: zgChain,
  transport: http(process.env.NEXT_PUBLIC_ZG_RPC_URL || 'https://evmrpc-testnet.0g.ai'),
})

export function getConfiguredAgenticTokenId(): bigint | null {
  if (!AGENTIC_ID_TOKEN_ID) return null
  try {
    return BigInt(AGENTIC_ID_TOKEN_ID)
  } catch {
    return null
  }
}

export function buildAgentMetadataHash(params: {
  name: string
  model: string
  provider: string
  capabilities: string[]
}): `0x${string}` {
  const canonical = JSON.stringify({
    name: params.name,
    model: params.model,
    provider: params.provider,
    capabilities: [...params.capabilities].sort(),
  })
  return keccak256(stringToHex(canonical))
}

export async function getMintFee(): Promise<bigint> {
  return (await publicClient.readContract({
    address: AGENTIC_ID_CONTRACT_ADDRESS,
    abi: AGENTIC_ID_ABI,
    functionName: 'mintFee',
  })) as bigint
}

export async function isAuthorizedUser(tokenId: bigint, user: Address): Promise<boolean> {
  try {
    const ok = await publicClient.readContract({
      address: AGENTIC_ID_CONTRACT_ADDRESS,
      abi: AGENTIC_ID_ABI,
      functionName: 'isAuthorizedUser',
      args: [tokenId, user],
    })
    return Boolean(ok)
  } catch (error) {
    console.error('[AgenticID] isAuthorizedUser failed:', error)
    return false
  }
}

export async function isAuthorizedForSifixAgent(user: Address): Promise<{
  enabled: boolean
  authorized: boolean
  tokenId?: string
  reason?: string
}> {
  const tokenId = getConfiguredAgenticTokenId()
  if (!tokenId) {
    return {
      enabled: false,
      authorized: true,
      reason: 'Agentic ID guard disabled (NEXT_PUBLIC_AGENTIC_ID_TOKEN_ID not set)',
    }
  }

  const authorized = await isAuthorizedUser(tokenId, user)
  return {
    enabled: true,
    authorized,
    tokenId: tokenId.toString(),
    reason: authorized ? 'Authorized by Agentic ID' : 'Wallet is not authorized for SIFIX Agent',
  }
}

/**
 * Server-side owner authorization (optional): uses PRIVATE_KEY to authorize user.
 * Useful for admin scripts/API, while normal UX should use wallet-sign on frontend.
 */
export async function authorizeUserServerSide(params: {
  tokenId: bigint
  user: Address
}): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const pk = (process.env.PRIVATE_KEY || process.env.COMPUTE_PRIVATE_KEY) as `0x${string}` | undefined
    if (!pk) {
      return { success: false, error: 'PRIVATE_KEY or COMPUTE_PRIVATE_KEY is not configured on server' }
    }

    const account = privateKeyToAccount(pk)
    const walletClient = createWalletClient({
      account,
      chain: zgChain,
      transport: http(process.env.NEXT_PUBLIC_ZG_RPC_URL || 'https://evmrpc-testnet.0g.ai'),
    })

    const hash = await walletClient.writeContract({
      address: AGENTIC_ID_CONTRACT_ADDRESS,
      abi: AGENTIC_ID_ABI,
      functionName: 'authorizeUsage',
      args: [params.tokenId, params.user],
    })

    return { success: true, txHash: hash }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'authorizeUsage failed',
    }
  }
}
