'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  History,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  Loader2,
  ArrowRight,
  Clock,
  Activity,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useScanHistory, type ScanRecord, type ScanStats } from '@/hooks/use-scan-history';

const RISK_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  SAFE: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-500' },
  LOW: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500' },
  MEDIUM: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-500' },
  HIGH: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-500' },
  CRITICAL: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' },
};

const REC_ICON = {
  BLOCK: <XCircle className="w-3.5 h-3.5" />,
  WARN: <AlertTriangle className="w-3.5 h-3.5" />,
  ALLOW: <CheckCircle className="w-3.5 h-3.5" />,
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function ScanHistoryPage() {
  const { address, isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading: loading } = useScanHistory(address, page, 20);
  const scans = data?.scans ?? [];
  const stats = data?.stats ?? null;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const filteredScans = searchQuery
    ? scans.filter(
        (s) =>
          s.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.threats.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : scans;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-accent-blue" />
            Scan History
          </h2>
          <p className="text-white/50 text-sm mt-1">
            All transaction scans performed with SIFIX Agent
          </p>
        </div>
        {stats && (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Activity className="w-3.5 h-3.5" />
            {stats.totalScans} scans tracked
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {stats && stats.totalScans > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/80 to-accent-blue flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/40">Total Scans</p>
                <p className="text-xl font-bold text-white">{stats.totalScans}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/70 to-accent-blue/90 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/40">Avg Risk Score</p>
                <p className="text-xl font-bold text-white">{stats.avgRiskScore}/100</p>
              </div>
            </div>
          </Card>
          <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue/80 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/40">Highest Risk</p>
                <p className="text-xl font-bold text-white">{stats.maxRiskScore}/100</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Search */}
      {scans.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by address or threat..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#FF6363]/40 transition-all"
          />
        </div>
      )}

      {/* Content */}
      {!isConnected ? (
        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Connect your wallet to view scan history</p>
          </div>
        </Card>
      ) : loading ? (
        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-accent-blue mx-auto mb-3 animate-spin" />
            <p className="text-white/40 text-sm">Loading scan history...</p>
          </div>
        </Card>
      ) : filteredScans.length === 0 ? (
        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
          <div className="p-12 text-center">
            <History className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60 font-medium">No scans yet</p>
            <p className="text-white/30 text-sm mt-1">
              Scan results will appear here after you analyze transactions
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredScans.map((scan) => {
            const colors = RISK_COLORS[scan.riskLevel] || RISK_COLORS.MEDIUM;
            return (
              <Card key={scan.id} className="bg-white/[0.04] backdrop-blur-md border-white/15">
                <button
                  onClick={() => setSelectedScan(selectedScan?.id === scan.id ? null : scan)}
                  className="w-full p-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Risk Badge */}
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center border ${colors.border}`}>
                      <span className={`text-xs font-bold ${colors.text}`}>
                        {scan.riskScore}
                      </span>
                    </div>

                    {/* Addresses */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-white/70 truncate">
                          {shortAddr(scan.from)}
                        </span>
                        <ArrowRight className="w-3 h-3 text-white/30 flex-shrink-0" />
                        <span className="font-mono text-white/70 truncate">
                          {shortAddr(scan.to)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${colors.bg} ${colors.text}`}>
                          {scan.riskLevel}
                        </span>
                        {scan.threats.length > 0 && (
                          <span className="text-[11px] text-white/30">
                            {scan.threats.slice(0, 2).join(', ')}
                            {scan.threats.length > 2 ? ` +${scan.threats.length - 2}` : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1 text-white/30">
                        {REC_ICON[scan.recommendation as keyof typeof REC_ICON] || REC_ICON.WARN}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-white/30">
                        <Clock className="w-3 h-3" />
                        {timeAgo(scan.analyzedAt)}
                      </div>
                      {scan.rootHash && (
                        <div className="w-5 h-5 rounded-md bg-[#FF6363]/10 flex items-center justify-center">
                          <Eye className="w-3 h-3 text-[#FF6363]" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {selectedScan?.id === scan.id && (
                  <div className="px-4 pb-4 pt-0 space-y-3 border-t border-white/[0.06] mt-0">
                    <div className="pt-3">
                      <p className="text-xs text-white/40 mb-1">Reasoning</p>
                      <p className="text-sm text-white/70">{scan.reasoning || 'No reasoning provided'}</p>
                    </div>
                    {scan.threats.length > 0 && (
                      <div>
                        <p className="text-xs text-white/40 mb-1">Detected Threats</p>
                        <div className="flex flex-wrap gap-1.5">
                          {scan.threats.map((t, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-white/30">
                      <span>Confidence: {Math.round(scan.confidence * 100)}%</span>
                      <span>Full From: <span className="font-mono">{scan.from}</span></span>
                    </div>
                    {scan.rootHash && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/30">0G Storage:</span>
                        <span className="text-[10px] font-mono text-white/50">{scan.rootHash.slice(0, 20)}...</span>
                        {scan.storageExplorer && (
                          <a
                            href={scan.storageExplorer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF6363] hover:text-[#ff4444]"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs text-white/50 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-xs text-white/30">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs text-white/50 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
