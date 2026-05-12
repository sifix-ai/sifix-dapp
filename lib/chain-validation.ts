import { isValidEthereumAddress } from '@/lib/address-validation'

export type ChainKey = '0g-galileo' | 'ethereum' | 'base' | 'bsc' | 'polygon'

const CHAIN_RPC: Record<ChainKey, string> = {
  '0g-galileo': process.env.ZERO_G_RPC_URL || 'https://evmrpc-testnet.0g.ai',
  ethereum: process.env.ETHEREUM_RPC_URL || 'https://ethereum.publicnode.com',
  base: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
  bsc: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
  polygon: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
}

const CHAIN_EXPLORER: Record<ChainKey, string> = {
  '0g-galileo': 'https://chainscan-galileo.0g.ai/address/',
  ethereum: 'https://etherscan.io/address/',
  base: 'https://basescan.org/address/',
  bsc: 'https://bscscan.com/address/',
  polygon: 'https://polygonscan.com/address/',
}

async function rpcCall(rpcUrl: string, method: string, params: unknown[]) {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  if (!res.ok) throw new Error(`RPC ${method} failed: ${res.status}`)
  return res.json() as Promise<{ result?: string; error?: { message?: string } }>
}

export async function validateAddressOnChain(address: string, chain: ChainKey = '0g-galileo') {
  if (!isValidEthereumAddress(address)) {
    return { validFormat: false, existsOnChain: false, isContract: false, txCount: 0, explorerUrl: null }
  }

  const rpcUrl = CHAIN_RPC[chain]
  const explorerUrl = `${CHAIN_EXPLORER[chain]}${address}`

  try {
    const [codeResp, nonceResp] = await Promise.all([
      rpcCall(rpcUrl, 'eth_getCode', [address, 'latest']),
      rpcCall(rpcUrl, 'eth_getTransactionCount', [address, 'latest']),
    ])

    const code = (codeResp.result || '0x').toLowerCase()
    const nonceHex = nonceResp.result || '0x0'
    const txCount = Number.parseInt(nonceHex, 16) || 0
    const isContract = code !== '0x'
    const existsOnChain = isContract || txCount > 0

    return { validFormat: true, existsOnChain, isContract, txCount, explorerUrl }
  } catch {
    return { validFormat: true, existsOnChain: false, isContract: false, txCount: 0, explorerUrl, rpcUnavailable: true }
  }
}
