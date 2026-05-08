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

const INTELLIGENT_DATA_ABI = [
  {
    type: 'function',
    name: 'getIntelligentDatas',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'tuple[]', components: [
      { name: 'dataDescription', type: 'string' },
      { name: 'dataHash', type: 'bytes32' },
    ]}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokenCreator',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'cloneSource',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'authorizedUsersOf',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address[]' }],
    stateMutability: 'view',
  },
] as const

export interface IntelligentData {
  dataDescription: string
  dataHash: `0x${string}`
}

export async function readIntelligentDatas(tokenId: bigint): Promise<IntelligentData[]> {
  return (await agenticIdPublicClient.readContract({
    address: AGENTIC_ID_CONTRACT_ADDRESS,
    abi: INTELLIGENT_DATA_ABI,
    functionName: 'getIntelligentDatas',
    args: [tokenId],
  })) as unknown as IntelligentData[]
}

export async function readTokenCreator(tokenId: bigint): Promise<Address> {
  return (await agenticIdPublicClient.readContract({
    address: AGENTIC_ID_CONTRACT_ADDRESS,
    abi: INTELLIGENT_DATA_ABI,
    functionName: 'tokenCreator',
    args: [tokenId],
  })) as Address
}

export async function readCloneSource(tokenId: bigint): Promise<bigint> {
  return (await agenticIdPublicClient.readContract({
    address: AGENTIC_ID_CONTRACT_ADDRESS,
    abi: INTELLIGENT_DATA_ABI,
    functionName: 'cloneSource',
    args: [tokenId],
  })) as bigint
}

export async function readAuthorizedUsers(tokenId: bigint): Promise<Address[]> {
  return (await agenticIdPublicClient.readContract({
    address: AGENTIC_ID_CONTRACT_ADDRESS,
    abi: INTELLIGENT_DATA_ABI,
    functionName: 'authorizedUsersOf',
    args: [tokenId],
  })) as Address[]
}

export async function readFullAgentProfile(tokenId: bigint) {
  const [owner, creator, cloneSrc, intelligentData, authorizedUsers] = await Promise.all([
    readOwnerOf(tokenId),
    readTokenCreator(tokenId),
    readCloneSource(tokenId),
    readIntelligentDatas(tokenId),
    readAuthorizedUsers(tokenId),
  ])

  // Known SIFIX metadata for hash verification
  const knownMetadata = {
    name: 'SIFIX Base Agent',
    model: '0g-llama-3.3-70b',
    provider: '0g-compute',
    capabilities: ['transaction-analysis', 'risk-assessment', 'signing-interception'],
  }
  const knownHash = buildSifixAgentMetadataHash({
    model: knownMetadata.model,
    provider: knownMetadata.provider,
    capabilities: knownMetadata.capabilities,
  })
  const hashVerified = intelligentData.length > 0 && intelligentData[0].dataHash === knownHash

  return {
    tokenId: tokenId.toString(),
    owner,
    creator,
    cloneSource: cloneSrc.toString(),
    intelligentData,
    authorizedUsers,
    metadata: knownMetadata,
    knownHash,
    hashVerified,
  }
}
