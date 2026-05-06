'use client';

import { useState, useEffect } from 'react';
import { Shield, TrendingUp, Users, AlertTriangle, Activity, BarChart3 } from 'lucide-react';
import Link from 'link';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, leaderboardRes] = await Promise.all([
        fetch('/api/v1/stats'),
        fetch('/api/v1/leaderboard'),
      ]);

      const statsData = await statsRes.json();
      const leaderboardData = await leaderboardRes.json();

      if (statsData.success) setStats(statsData.data);
      if (leaderboardData.success) setLeaderboard(leaderboardData.data.leaderboard);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Activity className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            </div>
            <Link href="/" className="text-purple-400 hover:text-purple-300">
              ← Back to Search
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats?.totalAddresses || 0}</div>
            <div className="text-sm text-gray-400">Total Addresses</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <TrendingUp className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats?.totalReports || 0}</div>
            <div className="text-sm text-gray-400">Threat Reports</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-purple-400" />
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats?.totalScans || 0}</div>
            <div className="text-sm text-gray-400">Transactions Scanned</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <span className="text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                CRITICAL
              </span>
            </div>
            <div className="text-3xl font-bold text-red-400 mb-1">{stats?.criticalThreats || 0}</div>
            <div className="text-sm text-gray-400">Critical Threats</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Top Reporters</h2>
          </div>

          <div className="space-y-4">
            {leaderboard.map((reporter, index) => (
              <div
                key={reporter.address}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="text-white font-mono text-sm">
                      {reporter.address.slice(0, 6)}...{reporter.address.slice(-4)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {reporter.reportsSubmitted} reports • {reporter.reportsVerified} verified
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{reporter.score}</div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="text-gray-400 text-sm">
            <p>Last 24 hours: {stats?.recentReports || 0} new reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}
