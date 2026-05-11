// SIFIX Smart Contract Configuration

// 0G Chain Testnet
export const ZEROG_CHAIN_ID = 16602;

export const SUPPORTED_CHAIN_IDS = [ZEROG_CHAIN_ID] as const;

export const CONTRACT_ADDRESSES = {
  [ZEROG_CHAIN_ID]: {
    ScamReporter: '0x544a39149d5169E4e1bDf7F8492804224CB70152',
  },
} as const;

export const SIFIX_REPUTATION_ADDRESS = '0x544a39149d5169E4e1bDf7F8492804224CB70152' as const;

/**
 * ScamReporter ABI — full ABI from ThreatReporter.json (ScamReporter contract).
 * Includes submitVote, submitReport (deprecated), hasVoted, addressToTargetId,
 * events (ScamVoteSubmitted, ScamReportSubmitted), and custom errors.
 */
export const SCAM_REPORTER_ABI = [
  {
    type: 'function',
    name: 'addressToTargetId',
    inputs: [
      { name: 'target', type: 'address', internalType: 'address' },
    ],
    outputs: [
      { name: '', type: 'bytes32', internalType: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'hasVoted',
    inputs: [
      { name: 'targetId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'reporterAddr', type: 'address', internalType: 'address' },
    ],
    outputs: [
      { name: '', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'submitReport',
    inputs: [
      { name: 'reasonHash', type: 'bytes32', internalType: 'bytes32' },
      { name: 'isScam', type: 'bool', internalType: 'bool' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'submitVote',
    inputs: [
      { name: 'targetType', type: 'uint8', internalType: 'uint8' },
      { name: 'targetId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'reasonHash', type: 'bytes32', internalType: 'bytes32' },
      { name: 'isScam', type: 'bool', internalType: 'bool' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'ScamReportSubmitted',
    inputs: [
      { name: 'reporter', type: 'address', indexed: true, internalType: 'address' },
      { name: 'reasonHash', type: 'bytes32', indexed: true, internalType: 'bytes32' },
      { name: 'isScam', type: 'bool', indexed: false, internalType: 'bool' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ScamVoteSubmitted',
    inputs: [
      { name: 'reporter', type: 'address', indexed: true, internalType: 'address' },
      { name: 'targetId', type: 'bytes32', indexed: true, internalType: 'bytes32' },
      { name: 'targetType', type: 'uint8', indexed: false, internalType: 'uint8' },
      { name: 'reasonHash', type: 'bytes32', indexed: false, internalType: 'bytes32' },
      { name: 'isScam', type: 'bool', indexed: false, internalType: 'bool' },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AlreadyVoted',
    inputs: [
      { name: 'targetId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'reporter', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'EmptyReasonHash',
    inputs: [],
  },
  {
    type: 'error',
    name: 'EmptyTargetId',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidTargetType',
    inputs: [],
  },
] as const;

export const CONTRACTS = {
  ScamReporter: {
    address: SIFIX_REPUTATION_ADDRESS,
    abi: SCAM_REPORTER_ABI,
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
