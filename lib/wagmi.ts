/**
 * Wagmi Configuration for SIFIX
 * 
 * Configured for 0G Newton Testnet
 */

import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { injected, walletConnect } from 'wagmi/connectors';

// 0G Newton Testnet
export const zgNewton = defineChain({
  id: 16602,
  name: '0G Newton Testnet',
  network: '0g-newton-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'A0GI',
    symbol: 'A0GI',
  },
  rpcUrls: {
    default: {
      http: ['https://evmrpc-testnet.0g.ai'],
    },
    public: {
      http: ['https://evmrpc-testnet.0g.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: '0G Explorer',
      url: 'https://chainscan-newton.0g.ai',
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [zgNewton],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    }),
  ],
  transports: {
    [zgNewton.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://evmrpc-testnet.0g.ai'),
  },
  ssr: true,
});

export { zgNewton as defaultChain };
