'use client';

import { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function DashboardPage() {
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

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-500 bg-red-500/10 border-red-500';
      case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500';
      case 'LOW': return 'text-green-500 bg-green-500/10 border-green-500';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL': return <XCircle className="w-6 h-6" />;
      case 'HIGH': return <AlertTriangle className="w-6 h-6" />;
      case 'MEDIUM': return <AlertTriangle className="w-6 h-6" />;
      case 'LOW': return <CheckCircle className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">SIFIX Dashboard</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Box */}
        <div className="mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Search Address Reputation</h2>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
                  placeholder="Enter Ethereum address (0x...)"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={searchAddress}
                disabled={loading}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Risk Score Card */}
            <div className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-8 ${getRiskColor(result.riskLevel)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getRiskIcon(result.riskLevel)}
                    <h3 className="text-2xl font-bold">{result.riskLevel} RISK</h3>
                  </div>
                  <p className="text-sm opacity-80">Risk Score: {result.riskScore}/100</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{result.riskScore}</div>
                  <div className="text-sm opacity-80">Total Reports: {result.totalReports}</div>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Address Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white font-mono">{result.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Chain:</span>
                  <span className="text-white">{result.chain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{result.addressType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">First Seen:</span>
                  <span className="text-white">{new Date(result.firstSeenAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Threat Reports */}
            {result.reports && result.reports.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">Threat Reports ({result.reports.length})</h3>
                <div className="space-y-4">
                  {result.reports.map((report: any) => (
                    <div key={report.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(report.riskLevel)}`}>
                            {report.threatType}
                          </span>
                          <span className="text-gray-400 text-xs">{report.status}</span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white text-sm">{report.explanation}</p>
                      <div className="mt-2 text-xs text-gray-400">
                        Severity: {report.severity}/100
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reputation Score */}
            {result.reputation && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">Reputation Score</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-white">{result.reputation.overallScore}</div>
                    <div className="text-sm text-gray-400">Overall Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{result.reputation.reportsSubmitted}</div>
                    <div className="text-sm text-gray-400">Reports Submitted</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{result.reputation.reportsVerified}</div>
                    <div className="text-sm text-gray-400">Verified</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">{result.reputation.reportsRejected}</div>
                    <div className="text-sm text-gray-400">Rejected</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
