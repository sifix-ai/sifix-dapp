'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

export default function ThreatsPage() {
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchThreats();
  }, [filter]);

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('riskLevel', filter);
      
      const res = await fetch(`/api/v1/threats?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setThreats(data.data.reports);
      }
    } catch (err) {
      console.error('Failed to fetch threats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/10 border-red-500 text-red-400';
      case 'HIGH': return 'bg-orange-500/10 border-orange-500 text-orange-400';
      case 'MEDIUM': return 'bg-yellow-500/10 border-yellow-500 text-yellow-400';
      case 'LOW': return 'bg-green-500/10 border-green-500 text-green-400';
      default: return 'bg-gray-500/10 border-gray-500 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <h1 className="text-2xl font-bold text-white">Threat Monitor</h1>
            </div>
            <Link href="/" className="text-purple-400 hover:text-purple-300">
              ← Back to Search
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8 flex gap-4">
          {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                filter === level
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {level === 'all' ? 'All' : level}
            </button>
          ))}
        </div>

        {/* Threats List */}
        {loading ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading threats...</p>
          </div>
        ) : threats.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No threats found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {threats.map((threat) => (
              <div
                key={threat.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(threat.riskLevel)}`}>
                      {threat.riskLevel}
                    </span>
                    <span className="text-gray-400 text-sm">{threat.threatType}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      {new Date(threat.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(threat.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Address:</div>
                  <Link
                    href={`/?address=${threat.address}`}
                    className="text-white font-mono text-sm hover:text-purple-400 transition-colors"
                  >
                    {threat.address}
                  </Link>
                </div>

                <p className="text-white mb-4">{threat.explanation}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">
                      Severity: <span className="text-white font-semibold">{threat.severity}/100</span>
                    </span>
                    <span className="text-gray-400">
                      Confidence: <span className="text-white font-semibold">{threat.confidence}%</span>
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    threat.status === 'VERIFIED' ? 'bg-green-500/10 text-green-400' :
                    threat.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {threat.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
