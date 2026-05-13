'use client';

import { useMemo, useState } from 'react';
import { TrendingUp, Activity, AlertTriangle, Shield, Users, X, Sparkles, Brain, Siren } from 'lucide-react';
import { useAnalyticsStats, useLeaderboard, useRecentPredictions } from '@/hooks/use-analytics';
import type { PredictionItem } from '@/services/dashboard-service';

const predictionFilters = [
  { id: 'all', label: 'All' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'unresolved', label: 'Pending' },
  { id: 'false_positive', label: 'False Positive' },
  { id: 'false_negative', label: 'False Negative' },
] as const;

type PredictionFilter = typeof predictionFilters[number]['id'];

function badgeTone(level: string) {
  if (level === 'CRITICAL' || level === 'HIGH') return 'text-red-300 border-red-500/20 bg-red-500/10';
  if (level === 'MEDIUM') return 'text-yellow-300 border-yellow-500/20 bg-yellow-500/10';
  return 'text-green-300 border-green-500/20 bg-green-500/10';
}

function statusTone(status: PredictionItem['tags']['status']) {
  if (status === 'correct') return 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10';
  if (status === 'wrong') return 'text-red-300 border-red-500/20 bg-red-500/10';
  return 'text-white/70 border-white/10 bg-white/5';
}

function shortAddress(value: string) {
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

export default function AnalyticsPage() {
  const [filter, setFilter] = useState<PredictionFilter>('all');
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionItem | null>(null);

  const { data: stats, isLoading: statsLoading } = useAnalyticsStats();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(50);
  const { data: recentPredictions, isLoading: predictionsLoading } = useRecentPredictions(filter, 12);

  const loading = statsLoading || leaderboardLoading || predictionsLoading;

  const heroStats = useMemo(() => {
    const summary = recentPredictions?.summary;
    return {
      falsePositive: summary?.falsePositive || 0,
      falseNegative: summary?.falseNegative || 0,
      pending: summary?.pending || 0,
    };
  }, [recentPredictions]);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(85,179,255,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,99,99,0.18),transparent_24%),rgba(255,255,255,0.03)] p-8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.02),transparent)]" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#55b3ff]/20 bg-[#55b3ff]/10 px-3 py-1 text-xs font-medium text-[#8ccfff]">
              <Sparkles className="h-3.5 w-3.5" />
              Hackathon demo control tower
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">AI Security Analytics</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/65 md:text-base">
                Live threat intelligence, prediction quality, and reviewer-ready evidence for risky transactions and signatures.
              </p>
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-xl">
            <div className="rounded-2xl border border-red-500/15 bg-red-500/8 p-4 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-red-200/80">False Positive</div>
              <div className="mt-2 text-2xl font-semibold text-white">{heroStats.falsePositive}</div>
              <div className="mt-1 text-xs text-white/55">High risk flagged, later disproved</div>
            </div>
            <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/8 p-4 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-yellow-200/80">False Negative</div>
              <div className="mt-2 text-2xl font-semibold text-white">{heroStats.falseNegative}</div>
              <div className="mt-1 text-xs text-white/55">Low risk predicted, later escalated</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">Pending Review</div>
              <div className="mt-2 text-2xl font-semibold text-white">{heroStats.pending}</div>
              <div className="mt-1 text-xs text-white/55">Waiting for community or intel resolution</div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Activity className="h-6 w-6 animate-spin text-white/40" />
        </div>
      ) : (
        <div className="space-y-6">
          {stats && (
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { icon: Shield, label: 'Addresses', value: stats.totalAddresses, tone: 'bg-[#55b3ff]/10 border-[#55b3ff]/20 text-[#55b3ff]' },
                { icon: AlertTriangle, label: 'Threat Reports', value: stats.totalReports, tone: 'bg-[#FF6363]/10 border-[#FF6363]/20 text-[#FF6363]' },
                { icon: Activity, label: 'TX Scans', value: stats.totalScans, tone: 'bg-[#5fc992]/10 border-[#5fc992]/20 text-[#5fc992]' },
                { icon: Siren, label: 'Critical', value: stats.criticalThreats, tone: 'bg-red-500/10 border-red-500/20 text-red-400' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${item.tone}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-white">{item.value}</div>
                      <div className="text-xs text-white/55">{item.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.6)]">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-[#55b3ff]" />
                      <h3 className="text-xl font-semibold text-white">Recent Predictions</h3>
                    </div>
                    <p className="mt-1 text-sm text-white/55">Trace every AI decision from analysis to ground-truth resolution.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {predictionFilters.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setFilter(item.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${filter === item.id ? 'border-[#55b3ff]/30 bg-[#55b3ff]/15 text-[#9fd6ff]' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white/80'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3 mb-5">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs text-white/50">Resolved</div>
                    <div className="mt-1 text-xl font-semibold text-white">{recentPredictions?.summary.correct || 0}/{recentPredictions?.summary.total || 0}</div>
                  </div>
                  <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-4">
                    <div className="text-xs text-red-200/70">False Positive</div>
                    <div className="mt-1 text-xl font-semibold text-white">{recentPredictions?.summary.falsePositive || 0}</div>
                  </div>
                  <div className="rounded-xl border border-yellow-500/15 bg-yellow-500/5 p-4">
                    <div className="text-xs text-yellow-200/70">False Negative</div>
                    <div className="mt-1 text-xl font-semibold text-white">{recentPredictions?.summary.falseNegative || 0}</div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/8">
                  <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.6fr] gap-3 border-b border-white/8 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.16em] text-white/40">
                    <div>Target</div>
                    <div>Risk</div>
                    <div>Provider</div>
                    <div>Status</div>
                    <div></div>
                  </div>
                  <div className="divide-y divide-white/6 bg-black/10">
                    {(recentPredictions?.predictions || []).map((prediction) => (
                      <div key={prediction.id} className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.6fr] gap-3 px-4 py-4 text-sm">
                        <div>
                          <div className="font-mono text-white">{shortAddress(prediction.targetAddress)}</div>
                          <div className="mt-1 text-xs text-white/45">{prediction.analysisType} • {new Date(prediction.createdAt).toLocaleString()}</div>
                        </div>
                        <div>
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${badgeTone(prediction.predictedRiskLevel)}`}>
                            {prediction.predictedRiskLevel} · {prediction.predictedRiskScore}
                          </span>
                        </div>
                        <div className="text-white/75">{prediction.provider}</div>
                        <div>
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(prediction.tags.status)}`}>
                            {prediction.tags.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => setSelectedPrediction(prediction)}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition-colors hover:border-[#55b3ff]/20 hover:text-white"
                          >
                            Inspect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.6)] space-y-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                  <h3 className="text-xl font-semibold text-white">Prediction Quality</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                    <div className="text-2xl font-bold text-white mb-1">{stats?.accuracy?.totalPredictions || 0}</div>
                    <div className="text-sm text-white/60">Total Predictions</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                    <div className="text-2xl font-bold text-white mb-1">{stats?.accuracy?.correctPredictions || 0}</div>
                    <div className="text-sm text-white/60">Correct Predictions</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                    <div className="text-2xl font-bold text-white mb-1">{stats?.accuracy?.resolvedPredictions || 0}</div>
                    <div className="text-sm text-white/60">Resolved Predictions</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                    <h4 className="mb-3 text-sm text-white/70">By Analysis Type</h4>
                    <div className="space-y-2">
                      {Object.entries(stats?.accuracy?.byAnalysisType || {}).map(([k, v]: any) => (
                        <div key={k} className="flex items-center justify-between text-sm">
                          <span className="text-white/70">{k}</span>
                          <span className="text-white font-medium">{v.accuracy}% ({v.correct}/{v.total})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                    <h4 className="mb-3 text-sm text-white/70">By Provider</h4>
                    <div className="space-y-2">
                      {Object.entries(stats?.accuracy?.byProvider || {}).map(([k, v]: any) => (
                        <div key={k} className="flex items-center justify-between text-sm">
                          <span className="text-white/70">{k}</span>
                          <span className="text-white font-medium">{v.accuracy}% ({v.correct}/{v.total})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.6)]">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-white" />
                  <h3 className="text-xl font-semibold text-white">Top Reporters</h3>
                </div>

                {!leaderboard || leaderboard.length === 0 ? (
                  <div className="py-8 text-center text-white/60">No reporters yet</div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.slice(0, 8).map((reporter: any, index: number) => (
                      <div key={reporter.address || index} className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.1]">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold ${
                            index === 0 ? 'border border-yellow-500/20 bg-yellow-500/10 text-yellow-400' :
                            index === 1 ? 'border border-gray-400/20 bg-gray-400/10 text-gray-300' :
                            index === 2 ? 'border border-orange-500/20 bg-orange-500/10 text-orange-400' :
                            'border border-white/10 bg-white/5 text-white/60'
                          }`}>
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-mono text-sm text-white">{reporter.address ? `${reporter.address.slice(0, 10)}...${reporter.address.slice(-8)}` : 'Unknown'}</div>
                            <div className="text-xs text-white/40">{reporter.reportCount ?? reporter.reportsSubmitted ?? 0} reports</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">{reporter.totalScore ?? reporter.reporterScore ?? 0}</div>
                          <div className="text-xs text-white/40">reputation</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.6)]">
                <h3 className="text-xl font-semibold text-white mb-6">Demo Narrative</h3>
                <div className="space-y-4">
                  {[
                    'Interception catches risky transaction or signature before wallet approval.',
                    'AI + GoPlus + community consensus merge into one explainable decision.',
                    'Prediction history proves learning loop and measurable security quality.',
                  ].map((text, index) => (
                    <div key={text} className="flex gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#55b3ff]/20 bg-[#55b3ff]/10 text-xs font-semibold text-[#8ccfff]">{index + 1}</div>
                      <p className="text-sm leading-6 text-white/70">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPrediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl border-l border-white/10 bg-[#0b0d10] p-6 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.8)] overflow-y-auto">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/40">Prediction detail</div>
                <h3 className="mt-2 text-2xl font-semibold text-white">{shortAddress(selectedPrediction.targetAddress)}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${badgeTone(selectedPrediction.predictedRiskLevel)}`}>
                    {selectedPrediction.predictedRiskLevel} · {selectedPrediction.predictedRiskScore}
                  </span>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(selectedPrediction.tags.status)}`}>
                    {selectedPrediction.tags.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedPrediction(null)} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                ['Analysis Type', selectedPrediction.analysisType],
                ['Provider', selectedPrediction.provider],
                ['Recommendation', selectedPrediction.predictedRecommendation],
                ['Confidence', `${selectedPrediction.predictedConfidence}%`],
                ['Ground Truth', selectedPrediction.groundTruthSource || 'pending'],
                ['Actual Outcome', selectedPrediction.actualOutcome || 'pending'],
                ['GoPlus Score', selectedPrediction.goPlusRiskScore ?? '-'],
                ['Community Risk', selectedPrediction.communityRiskLevel || '-'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-sm">
                  <span className="text-white/55">{label}</span>
                  <span className="max-w-[60%] truncate text-right text-white">{String(value)}</span>
                </div>
              ))}

              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                <div className="mb-3 text-sm text-white/60">Threat Signals</div>
                <div className="flex flex-wrap gap-2">
                  {selectedPrediction.predictedThreats.length > 0 ? selectedPrediction.predictedThreats.map((threat) => (
                    <span key={threat} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
                      {threat}
                    </span>
                  )) : <span className="text-sm text-white/45">No serialized threats</span>}
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 text-sm text-white/65 leading-6">
                <div>Created: {new Date(selectedPrediction.createdAt).toLocaleString()}</div>
                <div>Resolved: {selectedPrediction.resolvedAt ? new Date(selectedPrediction.resolvedAt).toLocaleString() : 'pending'}</div>
                <div className="mt-3 text-xs text-white/45">
                  Flags: {selectedPrediction.tags.falsePositive ? 'False Positive' : selectedPrediction.tags.falseNegative ? 'False Negative' : 'Normal'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
