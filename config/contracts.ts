// SIFIX Smart Contract Configuration

// 0G Chain Testnet
export const ZEROG_CHAIN_ID = 16602;

export const SUPPORTED_CHAIN_IDS = [ZEROG_CHAIN_ID] as const;

export const CONTRACT_ADDRESSES = {
  [ZEROG_CHAIN_ID]: {
    SifixReputation: '0x544a39149d5169E4e1bDf7F8492804224CB70152',
  },
} as const;

export const SIFIX_REPUTATION_ADDRESS = '0x544a39149d5169E4e1bDf7F8492804224CB70152' as const;

export const SIFIX_REPUTATION_ABI = [
  {
    "inputs": [
      {"internalType": "bytes32", "name": "targetId", "type": "bytes32"},
      {"internalType": "enum SifixReputation.TargetType", "name": "targetType", "type": "uint8"},
      {"internalType": "bytes32", "name": "reasonHash", "type": "bytes32"},
      {"internalType": "bool", "name": "isScam", "type": "bool"}
    ],
    "name": "reportTarget",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes32", "name": "targetId", "type": "bytes32"}
    ],
    "name": "getReputation",
    "outputs": [
      {"internalType": "uint256", "name": "totalReports", "type": "uint256"},
      {"internalType": "uint256", "name": "scamReports", "type": "uint256"},
      {"internalType": "uint256", "name": "legitimateReports", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "reporter", "type": "address"},
      {"indexed": true, "internalType": "bytes32", "name": "targetId", "type": "bytes32"},
      {"indexed": false, "internalType": "enum SifixReputation.TargetType", "name": "targetType", "type": "uint8"},
      {"indexed": false, "internalType": "bytes32", "name": "reasonHash", "type": "bytes32"},
      {"indexed": false, "internalType": "bool", "name": "isScam", "type": "bool"}
    ],
    "name": "TargetReported",
    "type": "event"
  }
] as const;

/**
 * Domain contract ABI (placeholder — to be replaced with actual ABI when available)
 * Used for .0g / custom domain resolution on-chain.
 */
export const DOMAIN_CONTRACT_ABI = [] as const;

/**
 * DOMAN_CONTRACT_ABI — legacy alias kept for backward-compatible imports.
 * @deprecated Use DOMAIN_CONTRACT_ABI instead.
 */
export const DOMAN_CONTRACT_ABI = DOMAIN_CONTRACT_ABI;

export const CONTRACTS = {
  SifixReputation: {
    address: SIFIX_REPUTATION_ADDRESS,
    abi: SIFIX_REPUTATION_ABI,
  },
} as const;

// ============================================
// 0G Agentic ID (ERC-7857)
// ============================================

/**
 * Official Agentic ID contract used in 0G examples (Galileo testnet).
 * Source: https://github.com/0gfoundation/agenticID-examples
 */
export const AGENTIC_ID_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_AGENTIC_ID_CONTRACT_ADDRESS ||
    '0x2700F6A3e505402C9daB154C5c6ab9cAEC98EF1F') as `0x${string}`;

/**
 * Base SIFIX Agent token ID (minted once by project owner).
 * Set this after minting, e.g. NEXT_PUBLIC_AGENTIC_ID_TOKEN_ID=1
 */
export const AGENTIC_ID_TOKEN_ID = process.env.NEXT_PUBLIC_AGENTIC_ID_TOKEN_ID;

/**
 * Minimal ABI needed for SIFIX integration
 */
export const AGENTIC_ID_ABI = [
  {
    type: 'function',
    name: 'mintFee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'iMint',
    inputs: [
      { name: 'to', type: 'address' },
      {
        name: 'datas',
        type: 'tuple[]',
        components: [
          { name: 'dataDescription', type: 'string' },
          { name: 'dataHash', type: 'bytes32' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'authorizeUsage',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'user', type: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'revokeAuthorization',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'user', type: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isAuthorizedUser',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'user', type: 'address' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ownerOf',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'UsageAuthorized',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: false },
      { name: 'user', type: 'address', indexed: false },
    ],
  },
] as const;

