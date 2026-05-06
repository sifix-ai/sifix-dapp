// SIFIX Smart Contract Configuration

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

export const CONTRACTS = {
  SifixReputation: {
    address: SIFIX_REPUTATION_ADDRESS,
    abi: SIFIX_REPUTATION_ABI,
  },
} as const;
