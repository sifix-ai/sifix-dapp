'use client'

import { useAccount, useDisconnect, useConnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { injected } from 'wagmi/connectors'
import { Wallet, LogOut } from 'lucide-react'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect } = useConnect()
  const { connectors } = useConnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1]">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-white/80 font-medium">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="text-white/80 hover:text-white"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="primary"
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-gradient-0g text-white hover:shadow-glow-accent"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </Button>
  )
}
