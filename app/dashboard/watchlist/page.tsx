"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from "@/hooks/use-watchlist"
import { Eye, Trash2, ArrowUpRight, ArrowDownRight, Plus, Shield } from "lucide-react"

interface WatchlistEntry {
  id: string
  watchedAddress: string
  label: string | null
  lastScore: number
  prevScore: number
  alertOnChange: boolean
  createdAt: string
  updatedAt: string
}

export default function WatchlistPage() {
  const { address: walletAddress, isConnected } = useAccount()
  const { data: watchlistData, isLoading: loading } = useWatchlist(walletAddress)
  const addMutation = useAddToWatchlist()
  const removeMutation = useRemoveFromWatchlist()

  const entries: WatchlistEntry[] = (watchlistData?.data || watchlistData || []) as WatchlistEntry[]

  const [showAdd, setShowAdd] = useState(false)
  const [newAddress, setNewAddress] = useState("")
  const [newLabel, setNewLabel] = useState("")

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddress.trim() || !walletAddress) return
    try {
      await addMutation.mutateAsync({
        userAddress: walletAddress,
        watchedAddress: newAddress.trim().toLowerCase(),
        label: newLabel.trim() || undefined,
      })
      setNewAddress("")
      setNewLabel("")
      setShowAdd(false)
    } catch {}
  }

  const handleRemove = async (watchedAddress: string) => {
    if (!walletAddress) return
    try {
      await removeMutation.mutateAsync({ watchedAddress, userAddress: walletAddress })
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Watchlist</h1>
          <p className="mt-1 text-sm text-white/50">Monitor addresses and get alerted on score changes</p>
        </div>
        {isConnected && (
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={14} className="mr-1" /> Add Address
          </Button>
        )}
      </div>

      {!isConnected ? (
        <Card>
          <div className="py-8 text-center text-sm text-white/30">Connect your wallet to manage your watchlist.</div>
        </Card>
      ) : (
        <>
          {showAdd && (
            <Card>
              <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="0x... wallet or contract address"
                  className="flex-1"
                />
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Label (optional)"
                  className="sm:w-48"
                />
                <Button type="submit" disabled={addMutation.isPending} size="sm">
                  {addMutation.isPending ? "Adding..." : "Add"}
                </Button>
              </form>
            </Card>
          )}

          {loading ? (
            <div className="py-12 text-center text-sm text-white/30">Loading...</div>
          ) : entries.length === 0 ? (
            <Card>
              <div className="py-8 text-center text-sm text-white/30">
                Your watchlist is empty. Add an address to start monitoring.
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {entries.map((item) => {
                const diff = item.lastScore - item.prevScore
                const isUp = diff > 0
                const isChanged = diff !== 0

                return (
                  <Card key={item.id} className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">
                          {item.label ?? `${item.watchedAddress.slice(0, 8)}...${item.watchedAddress.slice(-6)}`}
                        </p>
                        {item.label && (
                          <p className="mt-1 truncate font-mono text-xs text-white/30">{item.watchedAddress}</p>
                        )}
                      </div>
                      <div className="ml-4 flex gap-2">
                        <a
                          href={`/dashboard/checker?q=${item.watchedAddress}`}
                          className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
                        >
                          <Eye size={14} />
                        </a>
                        <button
                          onClick={() => handleRemove(item.watchedAddress)}
                          className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                          item.lastScore < 40 ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                          item.lastScore < 70 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-red-500/10 text-red-400 border border-red-500/20"
                        )}>
                          <Shield size={10} />
                          {100 - item.lastScore} Trust
                        </div>
                        {isChanged && (
                          <span className={cn("flex items-center gap-0.5 text-xs", isUp ? "text-red-400" : "text-green-400")}>
                            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {Math.abs(diff)}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/20">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
