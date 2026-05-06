// 0G Storage configuration
// Based on: https://docs.0g.ai/ai-context

export const ZG_STORAGE_CONFIG = {
  // Flow contract for storage uploads
  flowContract: '0x22E03a6A89B950F1c82ec5e74F8eCa321a105296',
  
  // Storage indexer RPC
  indexerRpc: 'https://indexer-storage-testnet-turbo.0g.ai',
  
  // Storage start block
  startBlock: 1,
  
  // DA (Data Availability) start block
  daStartBlock: 940000,
} as const;

export const ZG_PRECOMPILED_CONTRACTS = {
  // DA Signers precompiled contract
  daSigners: '0x0000000000000000000000000000000000001000',
  
  // Wrapped 0G Base token (like WETH)
  wrappedOGBase: '0x0000000000000000000000000000000000001001',
} as const;
