'use client'

import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Shield, Sparkles, TrendingUp } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#07080a] flex items-center justify-center p-4">
        {/* Background gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6363]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#55b3ff]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-md w-full">
          {/* Card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl backdrop-blur-xl p-8">
            {/* Icon */}
            <div className="w-16 h-16 bg-[#FF6363]/10 border border-[#FF6363]/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Shield className="w-8 h-8 text-[#FF6363]" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white text-center mb-3 tracking-tight">
              Connect Your Wallet
            </h1>

            {/* Description */}
            <p className="text-white/60 text-center mb-8 leading-relaxed">
              Connect your wallet to access AI-powered security features and protect your transactions.
            </p>

            {/* Custom Connect Button */}
            <div className="flex justify-center mb-8">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading'
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === 'authenticated')

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              type="button"
                              className="group relative px-8 py-4 bg-[#FF6363] text-white font-semibold rounded-xl hover:bg-[#FF6363]/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#FF6363]/30 hover:shadow-xl hover:shadow-[#FF6363]/40 uppercase tracking-wider text-sm"
                            >
                              <span className="flex items-center gap-2">
                                Connect Wallet
                                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                              </span>
                            </button>
                          )
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="px-8 py-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                            >
                              Wrong network
                            </button>
                          )
                        }

                        return (
                          <div className="flex gap-3">
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="px-4 py-2 bg-white/[0.05] border border-white/[0.08] text-white rounded-xl hover:bg-white/[0.08] transition-colors"
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    marginRight: 4,
                                  }}
                                >
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? 'Chain icon'}
                                      src={chain.iconUrl}
                                      style={{ width: 12, height: 12 }}
                                    />
                                  )}
                                </div>
                              )}
                              {chain.name}
                            </button>

                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="px-4 py-2 bg-white/[0.05] border border-white/[0.08] text-white rounded-xl hover:bg-white/[0.08] transition-colors font-mono text-sm"
                            >
                              {account.displayName}
                              {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ''}
                            </button>
                          </div>
                        )
                      })()}
                    </div>
                  )
                }}
              </ConnectButton.Custom>
            </div>

            {/* Info cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <div className="w-10 h-10 bg-[#FF6363]/10 border border-[#FF6363]/20 rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#FF6363]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">AI-Powered Security</h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Real-time transaction analysis with GPT-4 powered risk detection
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <div className="w-10 h-10 bg-[#55b3ff]/10 border border-[#55b3ff]/20 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#55b3ff]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">On-Chain Reputation</h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Decentralized threat reports stored on 0G Chain
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-white/40 text-xs text-center mt-6">
              Supported wallets: MetaMask, WalletConnect, Coinbase Wallet, and more
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
