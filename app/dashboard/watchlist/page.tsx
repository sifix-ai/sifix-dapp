"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from "@/hooks/use-watchlist"
import { Eye, Trash2, ArrowUpRight, ArrowDownRight, Plus, Shield } from "lucide-react"
import { toast } from "@/store/app-store"
import { watchlistFormSchema } from "@/lib/validation"
import { z } from "zod"

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
  const [formErrors, setFormErrors] = useState<{ address?: string; label?: string }>({})

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})

    if (!walletAddress) {
      toast.error("Please connect your wallet")
      return
    }

    // Validate with Zod
    try {
      const validated = watchlistFormSchema.parse({
        address: newAddress.trim(),
        label: newLabel.trim() || undefined,
      })

      await addMutation.mutateAsync({
        userAddress: walletAddress,
        watchedAddress: validated.address.toLowerCase(),
        label: validated.label,
      })
      
      toast.success("Address added to watchlist")
      setNewAddress("")
      setNewLabel("")
      setShowAdd(false)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { address?: string; label?: string } = {}
        err.errors.forEach((error) => {
          const field = error.path[0] as 'address' | 'label'
          errors[field] = error.message
        })
        setFormErrors(errors)
        toast.error("Please fix the form errors")
      }
      // API errors already handled by api-client
    }
  }

  const handleRemove = async (watchedAddress: string) => {
    if (!walletAddress) return
    try {
      await removeMutation.mutateAsync({ watchedAddress, userAddress: walletAddress })
      toast.success("Address removed from watchlist")
    } catch {
      // Error already handled by api-client
    }
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
              <form onSubmit={handleAdd} className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <Input
                      value={newAddress}
                      onChange={(e) => {
                        setNewAddress(e.target.value)
                        setFormErrors((prev) => ({ ...prev, address: undefined }))
                      }}
                      placeholder="0x... wallet or contract address"
                      className={cn(formErrors.address && "border-red-500/50")}
                      disabled={addMutation.isPending}
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.address}</p>
                    )}
                  </div>
                  <div className="sm:w-48">
                    <Input
                      value={newLabel}
                      onChange={(e) => {
                        setNewLabel(e.target.value)
                        setFormErrors((prev) => ({ ...prev, label: undefined }))
                      }}
                      placeholder="Label (optional)"
                      className={cn(formErrors.label && "border-red-500/50")}
                      disabled={addMutation.isPending}
                    />
                    {formErrors.label && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.label}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={addMutation.isPending} size="sm">
                      {addMutation.isPending ? "Adding..." : "Add"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAdd(false)
                        setNewAddress("")
                        setNewLabel("")
                        setFormErrors({})
                      }}
                      disabled={addMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
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
                          disabled={removeMutation.isPending}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                          item.lastScore < 40 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          item.lastScore < 70 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-red-500/10 text-red-400 border border-red-500/20"
                        )}>
                          <Shield size={10} />
                          {100 - item.lastScore} Trust
                        </div>
                        {isChanged && (
                          <span className={cn("flex items-center gap-0.5 text-xs", isUp ? "text-red-400" : "text-emerald-400")}>
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
