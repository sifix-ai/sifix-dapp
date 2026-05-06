import Link from 'next/link';
import { ArrowRight, Shield, Zap, Database, CheckCircle, BarChart3, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-16 h-16 text-purple-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              SIFIX
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              AI-Powered Wallet Security for Web3
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Protect your crypto transactions with real-time AI threat detection,
              on-chain reputation system, and decentralized storage on 0G Chain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/threats"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-colors"
              >
                View Threats
                <AlertTriangle className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <Zap className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Real-Time Detection</h3>
            <p className="text-gray-400">
              AI-powered transaction analysis intercepts threats before they execute.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <Database className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">0G Storage</h3>
            <p className="text-gray-400">
              Decentralized threat evidence storage with cryptographic proof.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">On-Chain Reputation</h3>
            <p className="text-gray-400">
              Transparent reputation system verified on 0G Chain smart contracts.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">2</div>
              <div className="text-gray-400">Addresses Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1</div>
              <div className="text-gray-400">Threats Detected</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1</div>
              <div className="text-gray-400">Transactions Scanned</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">1</div>
              <div className="text-gray-400">Critical Threats</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Secure Your Wallet?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Install the SIFIX browser extension and start protecting your crypto transactions today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-colors"
            >
              View Analytics
              <BarChart3 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>Built with ❤️ for 0G Chain APAC Hackathon 2026</p>
            <p className="mt-2">Team: Butuh Uwang | Developer: Zaky Arisandhi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
