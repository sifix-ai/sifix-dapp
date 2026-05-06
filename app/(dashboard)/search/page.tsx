'use client';

import { useState } from 'react';
import { Search, Shield, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { ConnectButton } from '@/components/connect-button';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function SearchPage() {
  const { isConnected } = useAccount();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const searchAddress = async () => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError('Invalid Ethereum address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/v1/address/${address}`);
      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to fetch address');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
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

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#FF6363]" />
            <span className="font-semibold text-white">SIFIX</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-sm text-white/60 hover:text-white transition-colors">
              Search
            </Link>
            <Link href="/threats" className="text-sm text-white/60 hover:text-white transition-colors">
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
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Search Box */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Address Reputation</h1>
          <p className="text-white/60 mb-6">Search any Ethereum address to check its security reputation</p>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
              placeholder="0x..."
              className="w-full h-12 pl-12 pr-24 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF6363]/50 transition-colors"
            />
            <button
              onClick={searchAddress}
              disabled={loading || !isConnected}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4 bg-[#FF6363] hover:bg-[#FF6363]/90 disabled:bg-white/10 disabled:text-white/40 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {!isConnected && (
            <p className="mt-3 text-sm text-yellow-400/80">
              ⚠️ Connect your wallet to search addresses
            </p>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Risk Card */}
            <div className={`p-6 border rounded-xl ${getRiskBadge(result.riskLevel)}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold mb-1">{result.riskLevel} RISK</div>
                  <div className="text-sm opacity-80">Risk Score: {result.riskScore}/100</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{result.riskScore}</div>
                  <div className="text-xs opacity-80">{result.totalReports} reports</div>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Address Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Address</span>
                  <span className="text-white font-mono">{result.address.slice(0, 10)}...{result.address.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Chain</span>
                  <span className="text-white">{result.chain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Type</span>
                  <span className="text-white">{result.addressType}</span>
                </div>
              </div>
            </div>

            {/* Threat Reports */}
            {result.reports && result.reports.length > 0 && (
              <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Threat Reports ({result.reports.length})</h3>
                <div className="space-y-3">
                  {result.reports.map((report: any) => (
                    <div key={report.id} className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-md ${getRiskBadge(report.riskLevel)}`}>
                          {report.threatType}
                        </span>
                        <span className="text-xs text-white/40">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-white/80">{report.explanation}</p>
                      <div className="mt-2 text-xs text-white/40">
                        Severity: {report.severity}/100
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
