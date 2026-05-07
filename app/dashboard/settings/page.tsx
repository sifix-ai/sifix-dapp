'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Settings, Bell, Shield, Globe, Moon, HardDrive } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  const { address } = useAccount();
  const [notifications, setNotifications] = useState(true);
  const [autoReport, setAutoReport] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Settings</h2>
        <p className="text-white/60">Manage your SIFIX preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Profile</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
            <div>
              <p className="text-sm text-white/80">Connected Wallet</p>
              <p className="text-xs text-white/40 font-mono mt-0.5">
                {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : 'Not connected'}
              </p>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-xs font-medium text-green-400">0G Newton</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
            <div>
              <p className="text-sm text-white/80">Threat Alerts</p>
              <p className="text-xs text-white/40 mt-0.5">Get notified when threats are detected</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-[#FF6363]' : 'bg-white/10'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Security</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
            <div>
              <p className="text-sm text-white/80">Auto-Report High/Critical Threats</p>
              <p className="text-xs text-white/40 mt-0.5">Automatically submit reports for severe threats</p>
            </div>
            <button
              onClick={() => setAutoReport(!autoReport)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoReport ? 'bg-[#FF6363]' : 'bg-white/10'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoReport ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Network */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Network</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
            <div>
              <p className="text-sm text-white/80">Chain</p>
              <p className="text-xs text-white/40 mt-0.5">0G Newton Testnet (Chain ID: 16602)</p>
            </div>
            <span className="text-xs font-mono text-[#4ecdc4]">evmrpc-testnet.0g.ai</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
