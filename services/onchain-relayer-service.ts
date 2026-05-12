import { createPublicClient, createWalletClient, defineChain, http, keccak256, stringToHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { CONTRACT_ADDRESSES, SCAM_REPORTER_ABI, ZEROG_CHAIN_ID } from '@/config/contracts'

const chain = defineChain({
  id: ZEROG_CHAIN_ID,
  name: '0G Galileo',
  network: '0g-galileo',
  nativeCurrency: { name: 'A0GI', symbol: 'A0GI', decimals: 18 },
  rpcUrls: { default: { http: [process.env.ZERO_G_RPC_URL || 'https://evmrpc-testnet.0g.ai'] } },
})

const publicClient = createPublicClient({ chain, transport: http() })

function getWalletClient() {
  const pk = (process.env.PRIVATE_KEY || process.env.COMPUTE_PRIVATE_KEY) as `0x${string}` | undefined
  if (!pk) throw new Error('Missing PRIVATE_KEY/COMPUTE_PRIVATE_KEY for relayer')
  const account = privateKeyToAccount(pk)
  return createWalletClient({ account, chain, transport: http() })
}

export class OnchainRelayerService {
  static buildReportHash(reportId: string, address: string, explanation: string) {
    return keccak256(stringToHex(`${reportId}:${address.toLowerCase()}:${explanation}`))
  }

  static async submitReportVote(targetAddress: string, reportHash: `0x${string}`, isScam: boolean) {
    const wallet = getWalletClient()
    const contract = CONTRACT_ADDRESSES[ZEROG_CHAIN_ID].ScamReporter as `0x${string}`

    const targetId = await publicClient.readContract({
      address: contract,
      abi: SCAM_REPORTER_ABI,
      functionName: 'addressToTargetId',
      args: [targetAddress as `0x${string}`],
    }) as `0x${string}`

    const txHash = await wallet.writeContract({
      address: contract,
      abi: SCAM_REPORTER_ABI,
      functionName: 'submitVote',
      args: [0, targetId, reportHash, isScam],
    })

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
    return { txHash, blockNumber: Number(receipt.blockNumber), contractAddress: contract, chainId: ZEROG_CHAIN_ID }
  }
}
