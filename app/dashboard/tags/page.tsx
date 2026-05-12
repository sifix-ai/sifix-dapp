"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTags, useAddTag } from "@/hooks/use-tags"
import { Tag, Plus, Search, AlertCircle, Wallet } from "lucide-react"
import { toast } from "@/store/app-store"
import { tagFormSchema } from "@/lib/validation"
import { z } from "zod"
import { useAccount } from "wagmi"

interface TagEntry {
  id: string
  tag: string
  taggedBy: string | null
  upvotes: number
  downvotes: number
  score: number
  createdAt: string
  address: string
  addressRisk: string
}

export default function TagsPage() {
  const { isConnected } = useAccount()
  const { data: tags = [], isLoading: loading, error } = useTags(100, 'addresses')
  const addTagMutation = useAddTag()

  const [searchQuery, setSearchQuery] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [addressInput, setAddressInput] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [formErrors, setFormErrors] = useState<{ address?: string; tag?: string }>({})

  const filtered = searchQuery
    ? tags.filter((t: TagEntry) =>
        t.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tags

  // Group tags by address
  const groupedByAddress = filtered.reduce((acc: Record<string, TagEntry[]>, tag: TagEntry) => {
    if (!acc[tag.address]) {
      acc[tag.address] = []
    }
    acc[tag.address].push(tag)
    return acc
  }, {})

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})

    // Validate with Zod
    try {
      const validated = tagFormSchema.parse({
        address: addressInput.trim(),
        tag: tagInput.trim().toLowerCase(),
      })

      await addTagMutation.mutateAsync({
        address: validated.address,
        tag: validated.tag,
        label: validated.tag,
      })
      
      toast.success("Tag added successfully!")
      setTagInput("")
      setAddressInput("")
      setShowAdd(false)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { address?: string; tag?: string } = {}
        err.errors.forEach((error) => {
          const field = error.path[0] as 'address' | 'tag'
          errors[field] = error.message
        })
        setFormErrors(errors)
        toast.error("Please fix the form errors")
      }
      // API errors already handled by api-client
    }
  }

  const riskColor = (risk: string) => {
    switch (risk) {
      case "CRITICAL": return "text-red-400 bg-red-500/10 border-red-500/20"
      case "HIGH": return "text-red-400 bg-red-500/10 border-red-500/20"
      case "MEDIUM": return "text-amber-400 bg-amber-500/10 border-amber-500/20"
      case "LOW": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      default: return "text-white/40 bg-white/5 border-white/10"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Community Tags</h1>
          <p className="mt-1 text-sm text-white/50">Human-submitted labels for wallets and contracts</p>
        </div>
        {isConnected ? (
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={14} className="mr-1" /> Add Tag
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="gap-1.5 text-white/40" disabled>
            <Wallet size={14} /> Connect to Add
          </Button>
        )}
      </div>

      {/* Add tag form */}
      {showAdd && (
        <Card>
          <form onSubmit={handleAddTag} className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Input
                  value={addressInput}
                  onChange={(e) => {
                    setAddressInput(e.target.value)
                    setFormErrors((prev) => ({ ...prev, address: undefined }))
                  }}
                  placeholder="0x... address"
                  className={cn(formErrors.address && "border-red-500/50")}
                  disabled={addTagMutation.isPending}
                />
                {formErrors.address && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.address}</p>
                )}
              </div>
              <div className="flex-1">
                <Input
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value)
                    setFormErrors((prev) => ({ ...prev, tag: undefined }))
                  }}
                  placeholder="Tag name (e.g. scammer, verified)"
                  className={cn(formErrors.tag && "border-red-500/50")}
                  disabled={addTagMutation.isPending}
                />
                {formErrors.tag && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.tag}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addTagMutation.isPending} size="sm">
                  {addTagMutation.isPending ? "Adding..." : "Add"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setShowAdd(false)
                    setTagInput("")
                    setAddressInput("")
                    setFormErrors({})
                  }}
                  disabled={addTagMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
            <p className="text-xs text-white/40">
              Tag must contain only lowercase letters, numbers, hyphens, and underscores
            </p>
          </form>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by address or tag name..."
          className="pl-10"
        />
      </div>

      {/* Error state */}
      {error && (
        <Card className="border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <div>
              <p className="font-medium">Failed to load tags</p>
              <p className="text-sm text-red-400/70">{error.message || "Unknown error"}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tags list grouped by address */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-sm text-white/30">Loading tags...</div>
        ) : Object.keys(groupedByAddress).length === 0 ? (
          <Card>
            <div className="py-8 text-center text-sm text-white/30">
              {searchQuery ? "No tags found matching your search." : "No tagged addresses yet."}
            </div>
          </Card>
        ) : (
          Object.entries(groupedByAddress).map(([address, addressTags]) => {
            const firstTag = addressTags[0]
            return (
              <Card key={address} className="space-y-3">
                {/* Address header */}
                <div className="flex items-center justify-between">
                  <p className="truncate font-mono text-sm text-white/70">{address}</p>
                  <span className={cn("ml-2 shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold border", riskColor(firstTag.addressRisk))}>
                    {firstTag.addressRisk}
                  </span>
                </div>
                
                {/* Tags for this address */}
                <div className="flex flex-wrap items-center gap-2">
                  {addressTags.map((entry) => (
                    <span 
                      key={entry.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/70 border border-white/10"
                    >
                      <Tag size={10} />
                      {entry.tag}
                      <span className="ml-1 text-white/30">
                        {entry.score > 0 ? `+${entry.score}` : entry.score}
                      </span>
                    </span>
                  ))}
                </div>

                {/* Tagged by info */}
                {addressTags[0].taggedBy && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] text-white/20 font-mono">
                      Tagged by {addressTags[0].taggedBy.slice(0, 6)}...{addressTags[0].taggedBy.slice(-4)}
                    </span>
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
