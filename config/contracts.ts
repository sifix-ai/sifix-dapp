// SIFIX Smart Contract Configuration

// 0G Galileo Testnet
export const ZEROG_CHAIN_ID = 16602;
export const SUPPORTED_CHAIN_IDS = [ZEROG_CHAIN_ID] as const;

/**
 * SIFIX Reputation contract address on 0G Galileo.
 * TODO: replace with freshly deployed address when migration deploy runs.
 */
export const SIFIX_REPUTATION_ADDRESS = '0xBBa8b030D80113e50271a2bbEeDBE109D9f1C42e' as const;

export const CONTRACT_ADDRESSES = {
  [ZEROG_CHAIN_ID]: {
    SifixReputation: SIFIX_REPUTATION_ADDRESS,
  },
} as const;

/**
 * SifixReputation ABI (minimal integration surface for dApp/reporting/indexer)
 */
export const SIFIX_REPUTATION_ABI = [
  {
    type: 'function',
    name: 'submitReport',
    inputs: [
      { name: 'target', type: 'address', internalType: 'address' },
      { name: 'threatType', type: 'uint8', internalType: 'enum SifixReputation.ThreatType' },
      { name: 'evidenceHash', type: 'bytes32', internalType: 'bytes32' },
      { name: 'severity', type: 'uint8', internalType: 'uint8' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'hasReportedTarget',
    inputs: [
      { name: 'target', type: 'address', internalType: 'address' },
      { name: 'reporter', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getReputation',
    inputs: [{ name: 'target', type: 'address', internalType: 'address' }],
    outputs: [
      { name: 'score', type: 'int256', internalType: 'int256' },
      { name: 'totalReports', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'SecurityReportSubmitted',
    inputs: [
      { name: 'reportId', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'reporter', type: 'address', indexed: true, internalType: 'address' },
      { name: 'targetId', type: 'bytes32', indexed: true, internalType: 'bytes32' },
      { name: 'target', type: 'address', indexed: false, internalType: 'address' },
      { name: 'threatType', type: 'uint8', indexed: false, internalType: 'enum SifixReputation.ThreatType' },
      { name: 'evidenceHash', type: 'bytes32', indexed: false, internalType: 'bytes32' },
      { name: 'severity', type: 'uint8', indexed: false, internalType: 'uint8' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AlreadyReported',
    inputs: [
      { name: 'targetId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'reporter', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidSeverity',
    inputs: [{ name: 'severity', type: 'uint8', internalType: 'uint8' }],
  },
  {
    type: 'error',
    name: 'InvalidTarget',
    inputs: [],
  },
] as const;

export const CONTRACTS = {
  SifixReputation: {
    address: SIFIX_REPUTATION_ADDRESS,
    abi: SIFIX_REPUTATION_ABI,
  },
} as const;

// ============================================
// 0G Agentic ID (ERC-7857)
// ============================================
export const AGENTIC_ID_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_AGENTIC_ID_CONTRACT_ADDRESS ||
    '0x2700F6A3e505402C9daB154C5c6ab9cAEC98EF1F') as `0x${string}`;

export const AGENTIC_ID_TOKEN_ID = process.env.NEXT_PUBLIC_AGENTIC_ID_TOKEN_ID;

export const AGENTIC_ID_ABI = [
  { type: 'function', name: 'mintFee', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'iMint', inputs: [{ name: 'to', type: 'address' }, { name: 'datas', type: 'tuple[]', components: [{ name: 'dataDescription', type: 'string' }, { name: 'dataHash', type: 'bytes32' }] }], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'payable' },
  { type: 'function', name: 'authorizeUsage', inputs: [{ name: 'tokenId', type: 'uint256' }, { name: 'user', type: 'address' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'revokeAuthorization', inputs: [{ name: 'tokenId', type: 'uint256' }, { name: 'user', type: 'address' }], outputs: [], stateMutability: 'nonpayable' },
  { type: 'function', name: 'isAuthorizedUser', inputs: [{ name: 'tokenId', type: 'uint256' }, { name: 'user', type: 'address' }], outputs: [{ name: '', type: 'bool' }], stateMutability: 'view' },
  { type: 'function', name: 'ownerOf', inputs: [{ name: 'tokenId', type: 'uint256' }], outputs: [{ name: '', type: 'address' }], stateMutability: 'view' },
] as const;
