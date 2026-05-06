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
        variant="ghost"
        size="sm"
        disabled
        className="bg-white/5 border border-white/10 text-white/60 hover:bg-white/5"
      >
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-2 h-2 bg-[#4ecdc4] rounded-full animate-pulse" />
          <span className="text-sm text-white/90 font-medium font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
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
        className="bg-[#FF6363] hover:bg-[#FF6363]/90 text-white border-0 shadow-lg hover:shadow-[0_0_20px_rgba(255,99,99,0.3)] transition-all duration-300"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
      {(localError || connectError) && (
        <div className="absolute top-full right-0 mt-2 flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1 max-w-xs whitespace-nowrap">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{localError || connectError?.message}</span>
        </div>
      )}
    </div>
  )
}
