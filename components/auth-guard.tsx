'use client'

import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          <div className="text-6xl">🔒</div>
          <h1 className="text-3xl font-bold text-white">Connect Your Wallet</h1>
          <p className="text-gray-400 max-w-md">
            You need to connect your wallet to access SIFIX security features
          </p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
