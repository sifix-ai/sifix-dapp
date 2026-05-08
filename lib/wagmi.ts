/**
 * Wagmi v3 Configuration
 *
 * Client-side wallet and contract interaction for 0G Newton Testnet.
 * Uses injected() for MetaMask and other wallet providers.
 */

import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { SIFIX_CHAIN } from '@/config/chains';

export const wagmiConfig = createConfig({
  chains: [SIFIX_CHAIN],
  connectors: [
    injected(),
  ],
  transports: {
    [SIFIX_CHAIN.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL ?? 'https://evmrpc-testnet.0g.ai'
    ),
  },
  ssr: true,
});

export { SIFIX_CHAIN };
