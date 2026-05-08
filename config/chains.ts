// 0G Chain configuration for SIFIX

export const SIFIX_CHAIN = {
  id: 16602,
  name: '0G Newton Testnet',
  network: '0g-galileo',
  nativeCurrency: {
    decimals: 18,
    name: 'A0GI',
    symbol: 'A0GI',
  },
  rpcUrls: {
    default: {
      http: ['https://evmrpc-testnet.0g.ai'], // Official RPC from docs.0g.ai
    },
    public: {
      http: ['https://evmrpc-testnet.0g.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: '0G Chain Explorer',
      url: 'https://chainscan-galileo.0g.ai',
    },
  },
  testnet: true,
} as const;

export const SUPPORTED_CHAINS = [SIFIX_CHAIN] as const;
