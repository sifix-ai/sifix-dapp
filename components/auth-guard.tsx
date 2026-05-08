'use client'

import { useAccount } from 'wagmi'
import { ConnectButton } from '@/components/connect-button'
import { Shield, Sparkles, TrendingUp } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080a] p-4">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-[#ff6363]/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-[#55b3ff]/20 blur-[120px]" />

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ff6363]/25 bg-[#ff6363]/12">
            <Shield className="h-8 w-8 text-[#ff6363]" />
          </div>

          <h1 className="mb-3 text-center text-3xl font-semibold tracking-tight text-white">
            Wallet Access Required
          </h1>
          <p className="mb-8 text-center text-sm leading-relaxed text-white/65">
            Connect your wallet to continue to the SIFIX dashboard and security features.
          </p>

          <div className="mb-8 flex justify-center">
            <ConnectButton />
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white">
                <Sparkles className="h-4 w-4 text-[#ff6363]" />
                AI Risk Analysis
              </div>
              <p className="text-xs text-white/60">Predictive scam detection before transactions are signed.</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white">
                <TrendingUp className="h-4 w-4 text-[#55b3ff]" />
                Reputation Layer
              </div>
              <p className="text-xs text-white/60">Live score and threat history powered by 0G Newton Testnet.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
