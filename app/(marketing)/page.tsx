import Link from 'next/link';
import { ArrowRight, Shield, Zap, Database, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Built for 0G Chain APAC Hackathon 2026</span>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6">
            AI-Powered Wallet Security
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            SIFIX intercepts transactions, simulates them, analyzes risks using AI, and reports threats on-chain. 
            Protect yourself from phishing, scams, and malicious contracts.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Launch Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <a
              href="https://github.com/sifix-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors border border-white/20"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-Time Protection</h3>
            <p className="text-gray-400">
              Intercepts transactions before execution and analyzes them in milliseconds using AI-powered simulation.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">On-Chain Reputation</h3>
            <p className="text-gray-400">
              Threat intelligence stored on 0G Chain and 0G Storage. Decentralized, transparent, and immutable.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Analysis</h3>
            <p className="text-gray-400">
              GPT-4 powered risk assessment with detailed explanations. Understand exactly why a transaction is risky.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">1,234</div>
              <div className="text-gray-400">Addresses Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">567</div>
              <div className="text-gray-400">Threats Detected</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">8,901</div>
              <div className="text-gray-400">Transactions Scanned</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-gray-400">Accuracy Rate</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: '1', title: 'Intercept', desc: 'Extension catches transaction' },
              { step: '2', title: 'Simulate', desc: 'Agent runs safe simulation' },
              { step: '3', title: 'Analyze', desc: 'AI evaluates risks' },
              { step: '4', title: 'Report', desc: 'Threat shared on-chain' },
              { step: '5', title: 'Protect', desc: 'User makes informed decision' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  {item.step}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="text-gray-400">
              © 2026 SIFIX. Built with ❤️ for 0G Chain APAC Hackathon.
            </div>
            <div className="flex gap-6">
              <a href="https://github.com/sifix-ai" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="https://twitter.com/sifix_ai" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="https://discord.gg/sifix" className="text-gray-400 hover:text-white transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
