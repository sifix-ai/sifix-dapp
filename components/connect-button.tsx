'use client'

import { useMemo, useState } from 'react'
import { useAccount, useChainId, useConnect, useConnectors, useDisconnect, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { AlertTriangle, ChevronRight, Loader2, LogOut, Network, ShieldCheck, Wallet } from 'lucide-react'
import { SIFIX_CHAIN } from '@/config/chains'

const CONNECTOR_META: Record<string, { label: string; description: string }> = {
  injected: {
    label: 'Browser Wallet',
    description: 'MetaMask, Rabby, or compatible browser extension',
  },
  metaMask: {
    label: 'MetaMask',
    description: 'Connect using MetaMask extension',
  },
  coinbaseWallet: {
    label: 'Coinbase Wallet',
    description: 'Connect using Coinbase Wallet extension',
  },
}

export function ConnectButton() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const chainId = useChainId()
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain()
  const { disconnect } = useDisconnect()
  const { connectAsync, error: connectError, isPending } = useConnect()
  const connectors = useConnectors()
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [activeConnectorId, setActiveConnectorId] = useState<string | null>(null)

  const availableConnectors = useMemo(
    () => connectors.filter((connector) => connector.id !== 'safe'),
    [connectors]
  )
  const isWrongNetwork = isConnected && chainId !== SIFIX_CHAIN.id
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null
  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : String(error)

  const connectWithConnector = async (connectorId: string) => {
    try {
      setLocalError(null)
      const selectedConnector = availableConnectors.find((connector) => connector.id === connectorId)

      if (!selectedConnector) {
        setLocalError('No wallet connectors available')
        return
      }

      setActiveConnectorId(selectedConnector.id)
      await connectAsync({ connector: selectedConnector })
      setIsWalletModalOpen(false)
    } catch (error: unknown) {
      const message = getErrorMessage(error)
      if (/cannot find module '@walletconnect\/ethereum/i.test(message)) {
        setLocalError('Connector wallet ini tidak tersedia. Gunakan browser wallet seperti MetaMask.')
      } else if (/provider not found/i.test(message)) {
        setLocalError('Provider wallet tidak ditemukan. Pastikan ekstensi wallet aktif.')
      } else {
        setLocalError(message || 'Failed to connect wallet')
      }
    } finally {
      setActiveConnectorId(null)
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      setLocalError(null)
      await switchChainAsync({ chainId: SIFIX_CHAIN.id })
    } catch (error: unknown) {
      setLocalError(getErrorMessage(error) || 'Failed to switch network')
    }
  }

  const handleDisconnect = () => {
    setLocalError(null)
    // Clear auth tokens on disconnect
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sifix_api_token')
      localStorage.removeItem('sifix_api_token_expires')
    }
    disconnect()
  }

  // ── Connecting state ──────────────────────────────────────────────────
  if (isConnecting || isReconnecting) {
    return (
      <Button
        size="sm"
        disabled
        className="h-9 rounded-xl border border-card-border bg-surface px-4 text-muted"
      >
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Connecting
      </Button>
    )
  }

  // ── Connected state ───────────────────────────────────────────────────
  if (isConnected && shortAddress) {
    return (
      <div className="relative flex items-center gap-2">
        {isWrongNetwork ? (
          <Button
            size="sm"
            onClick={handleSwitchNetwork}
            disabled={isSwitchingChain}
            className="h-9 rounded-xl border border-accent-red/40 bg-accent-red/10 px-3 text-xs font-medium text-accent-red hover:bg-accent-red/20"
          >
            {isSwitchingChain ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Network className="mr-2 h-3.5 w-3.5" />}
            Switch to 0G
          </Button>
        ) : (
          <div className="hidden rounded-xl border border-accent-green/30 bg-accent-green/10 px-2.5 py-1 text-[11px] font-medium text-accent-green sm:block">
            0G Galileo
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-card-border bg-surface px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-accent-green shadow-[0_0_12px_rgba(17,255,153,0.6)]" />
          <span className="font-mono text-xs font-semibold tracking-wide text-foreground">{shortAddress}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="h-9 w-9 rounded-xl border border-card-border bg-surface p-0 text-muted hover:bg-card hover:text-foreground"
          title="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
        </Button>

        {(localError || connectError) && (
          <div className="absolute top-full right-0 mt-2 flex max-w-xs items-center gap-2 rounded-xl border border-accent-red/30 bg-accent-red/10 px-3 py-2 text-xs text-accent-red">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{localError || connectError?.message}</span>
          </div>
        )}
      </div>
    )
  }

  // ── Disconnected state + Modal ────────────────────────────────────────
  return (
    <>
      <div className="relative w-full">
        <Button
          size="sm"
          onClick={() => setIsWalletModalOpen(true)}
          disabled={isPending}
          className="w-full h-10 rounded-xl border border-accent-blue/40 bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 hover:border-accent-blue/60 transition-all"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="mr-2 h-4 w-4" strokeWidth={2} />
          )}
          Connect Wallet
        </Button>

        {(localError || connectError) && (
          <div className="absolute top-full left-0 right-0 z-20 mt-2 flex items-center gap-2 rounded-xl border border-accent-red/30 bg-accent-red/10 px-3 py-2 text-xs text-accent-red">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{localError || connectError?.message}</span>
          </div>
        )}
      </div>

      <Modal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        title="Connect Wallet"
        maxWidth="max-w-md"
      >
        <div className="space-y-5">
          {/* Header info card */}
          <div className="rounded-xl border border-card-border bg-surface px-4 py-3">
            <p className="text-sm font-medium text-foreground">Choose your wallet</p>
            <p className="mt-1 text-xs text-muted">
              Connect to{' '}
              <span className="font-medium text-accent-green">0G Galileo Testnet</span>{' '}
              for secure access.
            </p>
          </div>

          {/* Connector list */}
          <div className="space-y-2">
            {availableConnectors.length === 0 && (
              <div className="rounded-xl border border-card-border bg-surface px-4 py-3 text-sm text-muted">
                No wallet connector detected. Please install MetaMask or Rabby extension.
              </div>
            )}

            {availableConnectors.map((connector) => {
              const connectorMeta = CONNECTOR_META[connector.id]
              const isActive = isPending && activeConnectorId === connector.id
              return (
                <button
                  key={connector.id}
                  type="button"
                  onClick={() => connectWithConnector(connector.id)}
                  disabled={isPending}
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-card-border bg-card px-4 py-3 text-left transition-colors duration-200 hover:border-accent-blue/40 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-card-border bg-surface">
                      <Wallet className="h-4 w-4 text-accent-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {connectorMeta?.label || connector.name}
                      </p>
                      <p className="text-xs text-muted">
                        {connectorMeta?.description || connector.name}
                      </p>
                    </div>
                  </div>

                  {isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin text-accent-blue" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Trust note */}
          <div className="rounded-xl border border-card-border bg-surface px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-accent-green" />
              We never store your private key. You approve every request in your wallet.
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
