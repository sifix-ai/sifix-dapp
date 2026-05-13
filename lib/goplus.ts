/**
 * GoPlus Security API Integration
 *
 * Provides address/contract security data from GoPlus:
 * - Address security (malicious labels, risk flags)
 * - Contract security (honeypot, proxy, mint functions)
 * - Token security (tax rates, holders, liquidity)
 *
 * Docs: https://docs.gopluslabs.io/
 */

import type { Address } from 'viem'

// ── Config ──────────────────────────────────────────────

const GOPUS_BASE_URL = 'https://api.gopluslabs.io/api/v1'
const GOPUS_V2_BASE_URL = 'https://api.gopluslabs.io/api/v2'
const TIMEOUT_MS = 12_000

function getApiKey(): string {
  return process.env.GOPUS_API_KEY || ''
}

function headers(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  const key = getApiKey()
  if (key) h['Authorization'] = `Bearer ${key}`
  return h
}

// ── Types ───────────────────────────────────────────────

export interface GoPlusAddressResult {
  address: string
  /** Overall risk score 0-100 (higher = more risky) */
  riskScore: number
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  /** True if GoPlus labels this address malicious */
  isMalicious: boolean
  /** Human-readable labels from GoPlus (phishing, malware, etc.) */
  labels: string[]
  /** Chain IDs where flags exist */
  flaggedChains: number[]
  /** Source of the data */
  source: 'goplus'
  /** Raw response for debugging */
  raw?: unknown
}

export interface GoPlusTokenResult {
  address: string
  chainId: number
  /** Token name */
  name: string
  /** Token symbol */
  symbol: string
  /** True if identified as honeypot */
  isHoneypot: boolean
  /** True if open-source contract */
  isOpenSource: boolean
  /** True if proxy contract */
  isProxy: boolean
  /** True if mint function found */
  canMint: boolean
  /** True if self-destruct possible */
  canSelfDestruct: boolean
  /** Buy tax percentage (0-100) */
  buyTax: number
  /** Sell tax percentage (0-100) */
  sellTax: number
  /** Whether holders are overly concentrated */
  holderConcentrationRisk: boolean
  /** LP holders count */
  lpHolders: number
  /** Total holders */
  totalHolders: number
  /** Risk score 0-100 */
  riskScore: number
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  source: 'goplus'
  raw?: unknown
}

export interface GoPlusContractResult {
  address: string
  chainId: number
  /** True if open-source */
  isOpenSource: boolean
  /** True if proxy */
  isProxy: boolean
  /** True if can self-destruct */
  canSelfDestruct: boolean
  /** Slippage modifiers */
  slippageModifiable: boolean
  /** True if ownership is renounced */
  ownershipRenounced: boolean
  /** External calls detected */
  externalCalls: boolean
  /** Risk score */
  riskScore: number
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  source: 'goplus'
  raw?: unknown
}

// ── Helpers ─────────────────────────────────────────────

function riskScoreToLevel(score: number): 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (score >= 80) return 'CRITICAL'
  if (score >= 60) return 'HIGH'
  if (score >= 40) return 'MEDIUM'
  if (score >= 20) return 'LOW'
  return 'SAFE'
}

function normalizeAddress(addr: string): string {
  return addr.toLowerCase()
}

// ── API Calls ───────────────────────────────────────────

/**
 * V1 address security check across chains
 */
async function fetchAddressSecurity(
  address: string,
  chainId: number = 0,
): Promise<{ result: Record<string, unknown> | null }> {
  const url = `${GOPUS_BASE_URL}/address_security/${address}?chain_id=${chainId}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { headers: headers(), signal: controller.signal })
    if (!res.ok) return { result: null }
    const json = await res.json()
    return { result: json?.result ?? null }
  } catch {
    return { result: null }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * V1 token security
 */
async function fetchTokenSecurity(
  address: string,
  chainId: number,
): Promise<{ result: Record<string, unknown> | null }> {
  const url = `${GOPUS_BASE_URL}/token_security/${chainId}?contract_addresses=${address}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { headers: headers(), signal: controller.signal })
    if (!res.ok) return { result: null }
    const json = await res.json()
    return { result: json?.result ?? null }
  } catch {
    return { result: null }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * V1 contract security
 */
async function fetchContractSecurity(
  address: string,
  chainId: number,
): Promise<{ result: Record<string, unknown> | null }> {
  const url = `${GOPUS_BASE_URL}/contract_security/${chainId}?contract_addresses=${address}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { headers: headers(), signal: controller.signal })
    if (!res.ok) return { result: null }
    const json = await res.json()
    return { result: json?.result ?? null }
  } catch {
    return { result: null }
  } finally {
    clearTimeout(timer)
  }
}

// ── Public API ──────────────────────────────────────────

/**
 * Check an address against GoPlus security database.
 * Returns null if GoPlus is unavailable or address not found.
 */
export async function checkAddressSecurity(
  address: Address | string,
  chainId: number = 0,
): Promise<GoPlusAddressResult | null> {
  const addr = normalizeAddress(address)
  const { result } = await fetchAddressSecurity(addr, chainId)
  if (!result) return null

  // Parse GoPlus response — they return an object keyed by chainId or a flat object
  const data = Array.isArray(result) ? result[0] : result

  const malicious = (data as any)?.malicious_address === '1' || (data as any)?.is_malicious === true
  const labels: string[] = []
  if ((data as any)?.attack_type) labels.push((data as any).attack_type)
  if ((data as any)?.label) labels.push((data as any).label)
  if ((data as any)?.tags) {
    const tags = (data as any).tags
    if (typeof tags === 'string') labels.push(...tags.split(','))
    else if (Array.isArray(tags)) labels.push(...tags)
  }

  let riskScore = malicious ? 85 : 0
  if ((data as any)?.risk_score !== undefined) {
    riskScore = Number((data as any).risk_score)
  }

  const flaggedChains: number[] = []
  if (chainId) flaggedChains.push(chainId)

  return {
    address: addr,
    riskScore,
    riskLevel: riskScoreToLevel(riskScore),
    isMalicious: malicious,
    labels,
    flaggedChains,
    source: 'goplus',
    raw: data,
  }
}

/**
 * Check a token contract against GoPlus token security.
 * chainId is required for token checks.
 */
export async function checkTokenSecurity(
  address: Address | string,
  chainId: number,
): Promise<GoPlusTokenResult | null> {
  if (!chainId) return null
  const addr = normalizeAddress(address)
  const { result } = await fetchTokenSecurity(addr, chainId)
  if (!result) return null

  // GoPlus returns map keyed by contract address
  const data = (result as Record<string, any>)[addr] ?? (Array.isArray(result) ? result[0] : result)
  if (!data) return null

  const isHoneypot = data.is_honeypot === '1'
  const isOpenSource = data.is_open_source === '1'
  const isProxy = data.is_proxy === '1'
  const canMint = data.is_mintable === '1'
  const canSelfDestruct = data.can_self_destruct === '1' || data.selfdestruct === '1'
  const buyTax = parseFloat(data.buy_tax ?? '0')
  const sellTax = parseFloat(data.sell_tax ?? '0')
  const lpHolders = parseInt(data.lp_holder_count ?? '0', 10)
  const totalHolders = parseInt(data.holder_count ?? '0', 10)
  const holderConcentrationRisk = totalHolders > 0
    ? (parseInt(data.holder_concentration ?? '0', 10) > 50)
    : false

  // Calculate risk score
  let riskScore = 0
  if (isHoneypot) riskScore += 50
  if (canSelfDestruct) riskScore += 25
  if (!isOpenSource) riskScore += 10
  if (isProxy) riskScore += 5
  if (canMint) riskScore += 10
  if (buyTax > 10) riskScore += 10
  if (sellTax > 10) riskScore += 10
  if (holderConcentrationRisk) riskScore += 5
  riskScore = Math.min(riskScore, 100)

  return {
    address: addr,
    chainId,
    name: data.token_name ?? '',
    symbol: data.token_symbol ?? '',
    isHoneypot,
    isOpenSource,
    isProxy,
    canMint,
    canSelfDestruct,
    buyTax,
    sellTax,
    holderConcentrationRisk,
    lpHolders,
    totalHolders,
    riskScore,
    riskLevel: riskScoreToLevel(riskScore),
    source: 'goplus',
    raw: data,
  }
}

/**
 * Check contract security via GoPlus.
 */
export async function checkContractSecurity(
  address: Address | string,
  chainId: number,
): Promise<GoPlusContractResult | null> {
  if (!chainId) return null
  const addr = normalizeAddress(address)
  const { result } = await fetchContractSecurity(addr, chainId)
  if (!result) return null

  const data = (result as Record<string, any>)[addr] ?? (Array.isArray(result) ? result[0] : result)
  if (!data) return null

  const isOpenSource = data.is_open_source === '1'
  const isProxy = data.is_proxy === '1'
  const canSelfDestruct = data.selfdestruct === '1'
  const slippageModifiable = data.slippage_modifiable === '1'
  const ownershipRenounced = data.ownership_renounced === '1'
  const externalCalls = data.external_calls === '1'

  let riskScore = 0
  if (canSelfDestruct) riskScore += 30
  if (!isOpenSource) riskScore += 15
  if (isProxy) riskScore += 10
  if (slippageModifiable) riskScore += 15
  if (externalCalls) riskScore += 10
  if (!ownershipRenounced) riskScore += 5
  riskScore = Math.min(riskScore, 100)

  return {
    address: addr,
    chainId,
    isOpenSource,
    isProxy,
    canSelfDestruct,
    slippageModifiable,
    ownershipRenounced,
    externalCalls,
    riskScore,
    riskLevel: riskScoreToLevel(riskScore),
    source: 'goplus',
    raw: data,
  }
}

/**
 * Comprehensive address enrichment — runs all applicable GoPlus checks.
 * Returns merged results suitable for analyze route enrichment.
 */
export interface GoPlusEnrichment {
  addressSecurity: GoPlusAddressResult | null
  tokenSecurity: GoPlusTokenResult | null
  contractSecurity: GoPlusContractResult | null
  /** Merged risk score (highest across all checks) */
  riskScore: number
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  /** All labels aggregated */
  labels: string[]
  /** Any flags that should be surfaced */
  flags: string[]
  /** Source identifier */
  source: 'goplus'
}

export async function enrichWithGoPlus(
  address: Address | string,
  chainId: number = 0,
): Promise<GoPlusEnrichment> {
  const addr = normalizeAddress(address)

  // Run all checks in parallel; each gracefully returns null on failure
  const [addressSec, tokenSec, contractSec] = await Promise.all([
    checkAddressSecurity(addr as Address, chainId).catch(() => null),
    chainId ? checkTokenSecurity(addr as Address, chainId).catch(() => null) : Promise.resolve(null),
    chainId ? checkContractSecurity(addr as Address, chainId).catch(() => null) : Promise.resolve(null),
  ])

  // Merge risk scores — take the max
  const scores = [
    addressSec?.riskScore ?? 0,
    tokenSec?.riskScore ?? 0,
    contractSec?.riskScore ?? 0,
  ]
  const riskScore = Math.max(...scores)

  // Aggregate labels
  const labels: string[] = []
  if (addressSec?.labels.length) labels.push(...addressSec.labels)
  if (tokenSec && (tokenSec.isHoneypot || tokenSec.canSelfDestruct)) {
    if (tokenSec.isHoneypot) labels.push('HONEYPOT')
    if (tokenSec.canSelfDestruct) labels.push('SELF_DESTRUCT')
  }

  // Build flags
  const flags: string[] = []
  if (addressSec?.isMalicious) flags.push('MALICIOUS_ADDRESS')
  if (tokenSec?.isHoneypot) flags.push('HONEYPOT_TOKEN')
  if (tokenSec?.buyTax > 10 || tokenSec?.sellTax > 10) flags.push('HIGH_TAX')
  if (contractSec?.canSelfDestruct) flags.push('SELF_DESTRUCT')
  if (contractSec?.isProxy && !contractSec?.isOpenSource) flags.push('CLOSED_SOURCE_PROXY')
  if (tokenSec?.canMint) flags.push('UNLIMITED_MINT')

  return {
    addressSecurity: addressSec,
    tokenSecurity: tokenSec,
    contractSecurity: contractSec,
    riskScore,
    riskLevel: riskScoreToLevel(riskScore),
    labels,
    flags,
    source: 'goplus',
  }
}
