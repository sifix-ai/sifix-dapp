"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTags, useAddTag } from "@/hooks/use-tags"
import { Tag, Plus, Search } from "lucide-react"

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
  const { data: tagsData, isLoading: loading } = useTags(50)
  const addTagMutation = useAddTag()

  const tags: TagEntry[] = (tagsData?.data || tagsData || []) as TagEntry[]

  const [searchQuery, setSearchQuery] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [addressInput, setAddressInput] = useState("")
  const [showAdd, setShowAdd] = useState(false)

  const filtered = searchQuery
    ? tags.filter(t =>
        t.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tags

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagInput.trim() || !addressInput.trim()) return
    try {
      await addTagMutation.mutateAsync({
        address: addressInput.trim(),
        tag: tagInput.trim(),
        label: tagInput.trim(),
      })
      setTagInput("")
      setAddressInput("")
      setShowAdd(false)
    } catch {}
  }

  const riskColor = (risk: string) => {
    switch (risk) {
      case "CRITICAL": return "text-red-400 bg-red-500/10 border-red-500/20"
      case "HIGH": return "text-red-400 bg-red-500/10 border-red-500/20"
      case "MEDIUM": return "text-amber-400 bg-amber-500/10 border-amber-500/20"
      default: return "text-green-400 bg-green-500/10 border-green-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Community Tags</h1>
          <p className="mt-1 text-sm text-white/50">Human-submitted labels for wallets and contracts</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={14} className="mr-1" /> Add Tag
        </Button>
      </div>

      {/* Add tag form */}
      {showAdd && (
        <Card>
          <form onSubmit={handleAddTag} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="0x... address"
              className="flex-1"
            />
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Tag name (e.g. scammer, verified)"
              className="flex-1"
            />
            <Button type="submit" disabled={addTagMutation.isPending} size="sm">
              {addTagMutation.isPending ? "Adding..." : "Add"}
            </Button>
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

      {/* Tags list */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-sm text-white/30">Loading tags...</div>
        ) : filtered.length === 0 ? (
          <Card>
            <div className="py-8 text-center text-sm text-white/30">
              {searchQuery ? "No tags found matching your search." : "No tagged addresses yet."}
            </div>
          </Card>
        ) : (
          filtered.map((entry) => (
            <Card key={entry.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="truncate font-mono text-sm text-white/70">{entry.address}</p>
                <span className={cn("ml-2 shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold border", riskColor(entry.addressRisk))}>
                  {entry.addressRisk}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/70 border border-white/10">
                  <Tag size={10} />
                  {entry.tag}
                  <span className="ml-1 text-white/30">
                    {entry.score > 0 ? `+${entry.score}` : entry.score}
                  </span>
                </span>
                {entry.taggedBy && (
                  <span className="text-[10px] text-white/20 font-mono">
                    by {entry.taggedBy.slice(0, 6)}...{entry.taggedBy.slice(-4)}
                  </span>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
