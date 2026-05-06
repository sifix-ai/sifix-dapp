'use client'

import { useAccount, useDisconnect, useConnect, useConnectors } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'

export function ConnectButton() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, error: connectError, isPending } = useConnect()
  const connectors = useConnectors()
  const [localError, setLocalError] = useState<string | null>(null)

  const handleConnect = async () => {
    try {
      setLocalError(null)
      if (connectors.length === 0) {
        setLocalError('No wallet connectors available')
        return
      }
      await connect({ connector: connectors[0] })
    } catch (err: any) {
      const message = err?.message || 'Failed to connect wallet'
      setLocalError(message)
      console.error('Wallet connection error:', err)
    }
  }

  const handleDisconnect = () => {
    try {
      setLocalError(null)
      disconnect()
    } catch (err: any) {
      console.error('Disconnect error:', err)
    }
  }

  // Show loading state during connection
  if (isConnecting || isReconnecting || isPending) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="text-white/80"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex flex-col items-end gap-2">
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
            onClick={handleDisconnect}
            className="text-white/80 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        variant="primary"
        onClick={handleConnect}
        disabled={isPending || connectors.length === 0}
        className="bg-gradient-0g text-white hover:shadow-glow-accent"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
      {(localError || connectError) && (
        <div className="flex items-center gap-1 text-xs text-red-400 max-w-xs">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{localError || connectError?.message}</span>
        </div>
      )}
    </div>
  )
}
