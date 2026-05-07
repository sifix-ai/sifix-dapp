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
