'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, TrendingUp, Activity, Clock } from 'lucide-react';
import { ConnectButton } from '@/components/connect-button';
import Link from 'next/link';

export default function ThreatsPage() {
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchThreats();
  }, [filter]);

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('riskLevel', filter);
      
      const res = await fetch(`/api/v1/threats?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setThreats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch threats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    const badges = {
      CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/20',
      HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      MEDIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      LOW: 'bg-green-500/10 text-green-400 border-green-500/20',
    };
    return badges[level as keyof typeof badges] || badges.LOW;
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#07080a]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07080a]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#FF6363]" />
            <span className="font-semibold text-white">SIFIX</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-sm text-white/60 hover:text-white transition-colors">
              Search
            </Link>
            <Link href="/threats" className="text-sm text-white hover:text-white transition-colors">
              Threats
            </Link>
            <Link href="/analytics" className="text-sm text-white/60 hover:text-white transition-colors">
              Analytics
            </Link>
          </nav>

          <ConnectButton />
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Threat Monitor</h1>
          <p className="text-white/60">Real-time feed of detected threats across the network</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-white/[0.03] text-white/60 border border-white/[0.08] hover:bg-white/[0.05]'
            }`}
          >
            All Threats
          </button>
          <button
            onClick={() => setFilter('CRITICAL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'CRITICAL'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-white/[0.03] text-white/60 border border-white/[0.08] hover:bg-white/[0.05]'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilter('HIGH')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'HIGH'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'bg-white/[0.03] text-white/60 border border-white/[0.08] hover:bg-white/[0.05]'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setFilter('MEDIUM')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'MEDIUM'
                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                : 'bg-white/[0.03] text-white/60 border border-white/[0.08] hover:bg-white/[0.05]'
            }`}
          >
            Medium
          </button>
        </div>

        {/* Threat List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Activity className="w-6 h-6 text-white/40 animate-spin" />
          </div>
        ) : threats.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No threats found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {threats.map((threat) => (
              <div
                key={threat.id}
                className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:border-white/[0.15] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRiskBadge(threat.riskLevel)}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getRiskBadge(threat.riskLevel)}`}>
                          {threat.threatType}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getRiskBadge(threat.riskLevel)}`}>
                          {threat.riskLevel}
                        </span>
                      </div>
                      <div className="text-sm text-white/40 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(threat.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{threat.severity}</div>
                    <div className="text-xs text-white/40">severity</div>
                  </div>
                </div>

                <p className="text-white/80 mb-4">{threat.explanation}</p>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                  <div className="text-sm">
                    <span className="text-white/40">Address: </span>
                    <Link 
                      href={`/search?address=${threat.targetAddress}`}
                      className="text-[#55b3ff] hover:underline font-mono"
                    >
                      {threat.targetAddress.slice(0, 10)}...{threat.targetAddress.slice(-8)}
                    </Link>
                  </div>
                  <div className="text-sm">
                    <span className="text-white/40">Reporter: </span>
                    <span className="text-white font-mono">
                      {threat.reporterAddress.slice(0, 6)}...{threat.reporterAddress.slice(-4)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
