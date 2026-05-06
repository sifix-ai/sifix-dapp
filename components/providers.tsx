'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'
import '@rainbow-me/rainbowkit/styles.css'

// 0G Newton Testnet
const zgNewton = defineChain({
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
})

const config = getDefaultConfig({
  appName: 'SIFIX',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [zgNewton],
  transports: {
    [zgNewton.id]: http(),
  },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
