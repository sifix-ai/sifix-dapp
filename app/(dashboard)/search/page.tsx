'use client'

import { AuthGuard } from '@/components/auth-guard'
import { useScanAddress, useAddressReputation } from '@/hooks/use-api'
import { useAppStore } from '@/store/app-store'
import { useState } from 'react'
import { addressSchema } from '@/lib/validations'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function SearchPage() {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const { addNotification } = useAppStore()
  
  const scanMutation = useScanAddress()
  const { data: reputation, isLoading: reputationLoading } = useAddressReputation(
    scanMutation.data?.address
  )

  const handleScan = async () => {
    try {
      setError('')
      addressSchema.parse(address)
      await scanMutation.mutateAsync({ address })
      addNotification({
        type: 'success',
        message: 'Address scanned successfully',
      })
    } catch (err: any) {
      const errorMsg = err.message || 'Invalid address format'
      setError(errorMsg)
      addNotification({
        type: 'error',
        message: errorMsg,
      })
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Search Address</h1>
            <ConnectButton />
          </div>

          {/* Search Form */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <label className="block text-sm font-medium mb-2">
              Ethereum Address
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleScan}
                disabled={scanMutation.isPending}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg font-medium transition"
              >
                {scanMutation.isPending ? 'Scanning...' : 'Scan'}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Scan Results */}
          {scanMutation.data && (
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Scan Results</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Risk Level</div>
                  <div className={`text-2xl font-bold ${
                    scanMutation.data.riskLevel === 'CRITICAL' ? 'text-red-500' :
                    scanMutation.data.riskLevel === 'HIGH' ? 'text-orange-500' :
                    scanMutation.data.riskLevel === 'MEDIUM' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {scanMutation.data.riskLevel}
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Risk Score</div>
                  <div className="text-2xl font-bold">{scanMutation.data.riskScore}/100</div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Threat Count</div>
                  <div className="text-2xl font-bold">{scanMutation.data.threatCount}</div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Recommendation</div>
                  <div className="text-lg font-bold">
                    {scanMutation.data.analysis?.recommendation || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Analysis</div>
                <p className="text-gray-300">
                  {scanMutation.data.analysis?.reasoning || 'No analysis available'}
                </p>
              </div>
            </div>
          )}

          {/* Reputation Data */}
          {reputation && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">On-Chain Reputation</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Score</div>
                  <div className="text-2xl font-bold">{reputation.score}/100</div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Reports</div>
                  <div className="text-2xl font-bold">{reputation.reportCount}</div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Last Update</div>
                  <div className="text-sm">
                    {reputation.lastUpdate ? new Date(reputation.lastUpdate).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>

              {reputation.reports && reputation.reports.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2">Recent Reports</h3>
                  <div className="space-y-2">
                    {reputation.reports.map((report: any, i: number) => (
                      <div key={i} className="bg-gray-800 rounded-lg p-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Severity: {report.severity}</span>
                          <span className="text-gray-400">
                            {new Date(report.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
