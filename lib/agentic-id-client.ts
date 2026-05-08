import { createPublicClient, http, keccak256, stringToHex, type Address } from 'viem'
import { SIFIX_CHAIN } from '@/config/chains'
import { AGENTIC_ID_ABI, AGENTIC_ID_CONTRACT_ADDRESS } from '@/config/contracts'

export const agenticIdPublicClient = createPublicClient({
  chain: SIFIX_CHAIN,
  transport: http(process.env.NEXT_PUBLIC_ZG_RPC_URL || 'https://evmrpc-testnet.0g.ai'),
})

export function buildSifixAgentMetadataHash(params: {
  model: string
  provider: string
  capabilities: string[]
}) {
  const canonical = JSON.stringify({
    name: 'SIFIX Base Agent',
    model: params.model,
    provider: params.provider,
    capabilities: [...params.capabilities].sort(),
  })
  return keccak256(stringToHex(canonical))
}

export async function readMintFee() {
  return (await agenticIdPublicClient.readContract({
    address: AGENTIC_ID_CONTRACT_ADDRESS,
    abi: AGENTIC_ID_ABI,
    functionName: 'mintFee',
  })) as bigint
}

export async function readIsAuthorized(tokenId: bigint, user: Address) {
  return Boolean(
    await agenticIdPublicClient.readContract({
      address: AGENTIC_ID_CONTRACT_ADDRESS,
      abi: AGENTIC_ID_ABI,
      functionName: 'isAuthorizedUser',
      args: [tokenId, user],
    })
  )
}

export async function readOwnerOf(tokenId: bigint) {
  return (await agenticIdPublicClient.readContract({
    address: AGENTIC_ID_CONTRACT_ADDRESS,
    abi: AGENTIC_ID_ABI,
    functionName: 'ownerOf',
    args: [tokenId],
  })) as Address
}
