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
        size="sm"
        disabled
        className="bg-violet-500/20 border-2 border-violet-500/30 text-violet-300 hover:bg-violet-500/20"
      >
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border-2 border-violet-500/30 backdrop-blur-sm">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse shadow-lg shadow-pink-400/50" />
          <span className="text-xs text-violet-300 font-mono font-medium">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 hover:text-violet-300"
        >
          <LogOut className="w-4 h-4" />
        </Button>
        {(localError || connectError) && (
          <div className="absolute top-full right-0 mt-2 flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1 max-w-xs">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{localError || connectError?.message}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        size="sm"
        onClick={handleConnect}
        disabled={isPending || connectors.length === 0}
        className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white border-0 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105"
      >
        <Wallet className="w-4 h-4 mr-2" strokeWidth={2} />
        Connect Wallet
      </Button>
      {(localError || connectError) && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 max-w-xs whitespace-nowrap backdrop-blur-sm">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{localError || connectError?.message}</span>
        </div>
      )}
    </div>
  )
}
