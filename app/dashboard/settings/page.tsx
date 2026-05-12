'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import {
  Settings,
  Bell,
  Shield,
  Globe,
  BrainCircuit,
  Key,
  Server,
  Cpu,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertCircle,
  Wallet,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAIProviderSettings, useUpdateAIProviderSettings } from '@/hooks/use-settings';
import { toast } from '@/store/app-store';

// ─── AI Provider Types ───────────────────────────────────────────────────────

type AIProvider = '0g_compute' | 'openai' | 'groq' | 'ollama' | 'custom';

interface ProviderOption {
  id: AIProvider;
  label: string;
  icon: string;
  defaultBaseUrl: string;
  defaultModel: string;
  requiresApiKey: boolean;
}

const PROVIDERS: ProviderOption[] = [
  {
    id: '0g_compute',
    label: '0G Compute',
    icon: '0G',
    defaultBaseUrl: 'https://compute.0g.ai/v1',
    defaultModel: '0g-llama-3.3-70b',
    requiresApiKey: true,
  },
  {
    id: 'openai',
    label: 'OpenAI',
    icon: 'OA',
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
    requiresApiKey: true,
  },
  {
    id: 'groq',
    label: 'Groq',
    icon: 'GQ',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    requiresApiKey: true,
  },
  {
    id: 'ollama',
    label: 'Ollama',
    icon: 'OL',
    defaultBaseUrl: 'http://localhost:11434/v1',
    defaultModel: 'llama3.2',
    requiresApiKey: false,
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: 'CU',
    defaultBaseUrl: '',
    defaultModel: '',
    requiresApiKey: true,
  },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { address, isConnected } = useAccount();
  const [notifications, setNotifications] = useState(true);
  const [autoReport, setAutoReport] = useState(false);

  // BYOAI state
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('0g_compute');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState(PROVIDERS[0].defaultBaseUrl);
  const [model, setModel] = useState(PROVIDERS[0].defaultModel);
  const [showApiKey, setShowApiKey] = useState(false);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // Load saved AI provider settings via TanStack Query
  const { data: savedSettings, isLoading: settingsLoading } = useAIProviderSettings(address ?? undefined)

  // Derived: is the current provider locked (default → 0G Compute)?
  const isLocked = savedSettings?.isLocked === true;

  // Apply loaded settings to local state (once)
  useEffect(() => {
    if (!savedSettings) return
    if (savedSettings.aiProvider) {
      const provider = savedSettings.aiProvider === '0g-compute' ? '0g_compute' : savedSettings.aiProvider;
      setSelectedProvider(provider as AIProvider);
    }
    if (savedSettings.aiApiKey) setApiKey(savedSettings.aiApiKey);
    if (savedSettings.aiBaseUrl) setBaseUrl(savedSettings.aiBaseUrl);
    if (savedSettings.aiModel) setModel(savedSettings.aiModel);
  }, [savedSettings])

  // Save mutation
  const updateSettingsMutation = useUpdateAIProviderSettings()

  const saving = updateSettingsMutation.isPending

  // Handle provider change — reset fields to provider defaults
  const handleProviderChange = useCallback((provider: AIProvider) => {
    const config = PROVIDERS.find((p) => p.id === provider)!;
    setSelectedProvider(provider);
    setBaseUrl(config.defaultBaseUrl);
    setModel(config.defaultModel);
    setProviderDropdownOpen(false);
  }, []);

  // Save AI provider settings via mutation
  const handleSave = useCallback(async () => {
    if (!address) return;
    setSaveStatus('idle');
    setSaveMessage('');

    // Frontend uses "0g_compute" but DB/API uses "0g-compute"
    const apiProvider = selectedProvider === '0g_compute' ? '0g-compute' : selectedProvider;

    try {
      await updateSettingsMutation.mutateAsync({
        address,
        aiProvider: apiProvider,
        aiApiKey: apiKey || undefined,
        aiBaseUrl: baseUrl || undefined,
        aiModel: model || undefined,
      })
      setSaveStatus('success');
      setSaveMessage('AI provider settings saved successfully');
      toast.success('AI provider settings saved successfully!')
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to save settings';
      setSaveStatus('error');
      setSaveMessage(errMsg);
      // Error already shown by api-client, but we can add custom message
    } finally {
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 4000);
    }
  }, [address, selectedProvider, apiKey, baseUrl, model, updateSettingsMutation]);

  const currentProviderConfig = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];

  // Guard: Wallet not connected
  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-accent-blue" />
            Settings
          </h2>
          <p className="text-white/60">Manage your SIFIX preferences</p>
        </div>

        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
          <div className="p-12 text-center">
            <Settings className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Connect your wallet to access settings</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-accent-blue" />
          Settings
        </h2>
        <p className="text-white/50 text-sm mt-1">Manage your SIFIX preferences</p>
      </div>

      {/* ─── BYOAI Section ───────────────────────────────────────────────── */}
      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 flex items-center justify-center border border-accent-blue/20">
            <BrainCircuit className="w-4 h-4 text-accent-blue" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">BYOAI — Bring Your Own AI</h3>
            <p className="text-xs text-white/40 mt-0.5">
              Connect your own AI provider for threat analysis
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Provider
              </div>
            </label>
            <div className="relative">
              <button
                onClick={() => !isLocked && setProviderDropdownOpen(!providerDropdownOpen)}
                disabled={isLocked}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                  isLocked
                    ? 'border-white/[0.04] bg-white/[0.01] cursor-not-allowed opacity-60'
                    : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center border border-white/[0.06]">
                    <span className="text-[10px] font-bold text-white/60">
                      {currentProviderConfig.icon}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-white font-medium">
                      {currentProviderConfig.label}
                    </span>
                    <p className="text-[11px] text-white/30 mt-0.5">
                      {currentProviderConfig.defaultBaseUrl || 'Custom endpoint'}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-white/40 transition-transform ${providerDropdownOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {/* Dropdown */}
              {!isLocked && providerDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProviderDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-white/[0.08] bg-[#101111]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
                    {PROVIDERS.map((provider) => {
                      const isSelected = provider.id === selectedProvider;
                      return (
                        <button
                          key={provider.id}
                          onClick={() => handleProviderChange(provider.id)}
                          className={`w-full flex items-center justify-between p-3 hover:bg-white/[0.04] transition-colors ${isSelected ? 'bg-white/[0.04]' : ''
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center border ${isSelected
                                  ? 'bg-[#FF6363]/10 border-[#FF6363]/30'
                                  : 'bg-white/[0.04] border-white/[0.06]'
                                }`}
                            >
                              <span
                                className={`text-[10px] font-bold ${isSelected ? 'text-[#FF6363]' : 'text-white/50'
                                  }`}
                              >
                                {provider.icon}
                              </span>
                            </div>
                            <div className="text-left">
                              <span
                                className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/70'
                                  }`}
                              >
                                {provider.label}
                              </span>
                              <p className="text-[11px] text-white/30 mt-0.5">
                                {provider.defaultBaseUrl || 'Configure your own endpoint'}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#FF6363]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Locked provider info banner */}
          {isLocked && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-accent-blue/[0.06] border border-accent-blue/[0.12]">
              <Lock className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
              <p className="text-xs text-white/50 leading-relaxed">
                Default provider uses <span className="text-white/70 font-medium">0G Compute</span> (qwen-2.5-7b-instruct) — configuration is locked.
              </p>
            </div>
          )}

          {/* API Key Input */}
          {currentProviderConfig.requiresApiKey && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                <div className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  API Key
                </div>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => !isLocked && setApiKey(e.target.value)}
                  disabled={isLocked}
                  placeholder={
                    selectedProvider === 'openai'
                      ? 'sk-...'
                      : selectedProvider === 'groq'
                        ? 'gsk_...'
                        : 'Enter your API key'
                  }
                  className={`w-full rounded-xl bg-white/[0.02] px-4 py-3 pr-10 text-sm text-white placeholder:text-white/20 outline-none transition-all ${
                    isLocked
                      ? 'border-white/[0.04] opacity-50 cursor-not-allowed'
                      : 'border border-white/[0.08] focus:border-[#FF6363]/40 focus:ring-1 focus:ring-[#FF6363]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => !isLocked && setShowApiKey(!showApiKey)}
                  disabled={isLocked}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                    isLocked ? 'text-white/20 cursor-not-allowed' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-white/25 mt-1.5">
                {selectedProvider === '0g_compute'
                  ? 'Get your key from the 0G Compute dashboard'
                  : selectedProvider === 'openai'
                    ? 'Platform keys from platform.openai.com'
                    : selectedProvider === 'groq'
                      ? 'Console keys from console.groq.com'
                      : 'Your provider API key'}
              </p>
            </div>
          )}

          {/* Base URL Input */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              <div className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                Base URL
              </div>
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => !isLocked && setBaseUrl(e.target.value)}
              disabled={isLocked}
              placeholder="https://api.example.com/v1"
              className={`w-full rounded-xl bg-white/[0.02] px-4 py-3 text-sm text-white font-mono placeholder:text-white/20 outline-none transition-all ${
                isLocked
                  ? 'border-white/[0.04] opacity-50 cursor-not-allowed'
                  : 'border border-white/[0.08] focus:border-[#FF6363]/40 focus:ring-1 focus:ring-[#FF6363]/20'
              }`}
            />
            <p className="text-[11px] text-white/25 mt-1.5">
              {selectedProvider === 'ollama'
                ? 'Default: http://localhost:11434 — change if Ollama runs elsewhere'
                : 'OpenAI-compatible API endpoint'}
            </p>
          </div>

          {/* Model Input */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Model
              </div>
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => !isLocked && setModel(e.target.value)}
              disabled={isLocked}
              placeholder="gpt-4o"
              className={`w-full rounded-xl bg-white/[0.02] px-4 py-3 text-sm text-white font-mono placeholder:text-white/20 outline-none transition-all ${
                isLocked
                  ? 'border-white/[0.04] opacity-50 cursor-not-allowed'
                  : 'border border-white/[0.08] focus:border-[#FF6363]/40 focus:ring-1 focus:ring-[#FF6363]/20'
              }`}
            />
            <p className="text-[11px] text-white/25 mt-1.5">
              {selectedProvider === 'openai'
                ? 'Recommended: gpt-4o, gpt-4o-mini, gpt-4-turbo'
                : selectedProvider === 'groq'
                  ? 'Recommended: llama-3.3-70b-versatile, mixtral-8x7b-32768'
                  : selectedProvider === 'ollama'
                    ? 'Use any model pulled via `ollama pull`'
                    : 'Model identifier used by your provider'}
            </p>
          </div>

          {/* Save Button & Status */}
          {!isLocked && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !isConnected}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${saving || !isConnected
                  ? 'bg-white/[0.04] text-white/30 cursor-not-allowed border border-white/[0.06]'
                  : 'bg-gradient-to-r from-accent-blue/80 to-accent-blue text-white hover:shadow-lg hover:shadow-accent-blue/20 hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Provider
                </>
              )}
            </button>

            {/* Inline status feedback */}
            {saveStatus !== 'idle' && (
              <div
                className={`flex items-center gap-1.5 text-sm animate-in fade-in duration-300 ${saveStatus === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}
              >
                {saveStatus === 'success' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                {saveMessage}
              </div>
            )}
          </div>
          )}
        </div>
      </Card>

      {/* Notifications */}
      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <div className="flex items-center gap-3 mb-4">
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-accent-blue' : 'bg-white/10'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Security</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
            <div>
              <p className="text-sm text-white/80">Auto-Report High/Critical Threats</p>
              <p className="text-xs text-white/40 mt-0.5">
                Automatically submit reports for severe threats
              </p>
            </div>
            <button
              onClick={() => setAutoReport(!autoReport)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoReport ? 'bg-accent-blue' : 'bg-white/10'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoReport ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Network */}
      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Network</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
            <div>
              <p className="text-sm text-white/80">Chain</p>
              <p className="text-xs text-white/40 mt-0.5">0G Galileo Testnet (Chain ID: 16602)</p>
            </div>
            <span className="text-xs font-mono text-accent-blue">evmrpc-testnet.0g.ai</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
