'use client'

import { useAccount, useDisconnect, useConnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { injected } from 'wagmi/connectors'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect } = useConnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-sm text-gray-400">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => disconnect()}
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="primary"
      size="md"
      onClick={() => connect({ connector: injected() })}
    >
      Connect Wallet
    </Button>
  )
}
