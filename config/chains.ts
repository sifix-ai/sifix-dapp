// 0G Chain configuration for SIFIX

export const SIFIX_CHAIN = {
  id: 16602,
  name: '0G Newton Testnet',
  network: '0g-newton',
  nativeCurrency: {
    decimals: 18,
    name: 'A0GI',
    symbol: 'A0GI',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.0g.ai'],
    },
    public: {
      http: ['https://rpc-testnet.0g.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: '0G Chain Explorer',
      url: 'https://chainscan-newton.0g.ai',
    },
  },
  testnet: true,
} as const;

export const SUPPORTED_CHAINS = [SIFIX_CHAIN] as const;
