'use client'

import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Shield, Sparkles, Lock, Zap } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#07080a] text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Gradient Orbs Background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6363]/20 rounded-full blur-[120px] animate-pulse -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#55b3ff]/20 rounded-full blur-[120px] animate-pulse -z-10" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-md w-full relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6363]/30 to-[#55b3ff]/30 rounded-3xl blur-2xl" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF6363]/20 to-[#55b3ff]/20 border border-white/[0.08] rounded-3xl flex items-center justify-center backdrop-blur-xl">
                <Shield className="w-12 h-12 text-[#FF6363]" />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Connect Your Wallet
            </h1>
            
            <p className="text-lg text-white/60 leading-relaxed mb-2">
              Connect your Web3 wallet to access SIFIX security features
            </p>
            
            <p className="text-sm text-white/40">
              Scan addresses, view threat intelligence, and protect your assets
            </p>
          </div>
          
          {/* Connect Button */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6363] to-[#55b3ff] rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative">
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
                      (!authenticationStatus ||
                        authenticationStatus === 'authenticated')

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          'style': {
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
                                className="px-8 py-4 bg-gradient-to-r from-[#FF6363] to-[#FF6363]/80 hover:from-[#FF6363]/90 hover:to-[#FF6363]/70 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-[#FF6363]/30 flex items-center gap-3"
                              >
                                <Lock className="w-5 h-5" />
                                Connect Wallet
                                <Zap className="w-5 h-5" />
                              </button>
                            )
                          }

                          return null
                        })()}
                      </div>
                    )
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          </div>
          
          {/* Info Cards */}
          <div className="space-y-3">
            <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-xl p-4 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#FF6363]/10 border border-[#FF6363]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#FF6363]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-white">AI-Powered Security</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Real-time transaction analysis with GPT-4 powered threat detection
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-xl p-4 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#55b3ff]/10 border border-[#55b3ff]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#55b3ff]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 text-white">On-Chain Reputation</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Decentralized threat reports stored on 0G Chain for transparency
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-white/40">
              Supported wallets: MetaMask, WalletConnect, Coinbase Wallet, and more
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
