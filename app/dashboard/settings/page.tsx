'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useDealSync } from '@/context/DealSyncContext';
import { 
  Settings, 
  ShieldCheck, 
  Bell, 
  Key, 
  Sliders, 
  Database, 
  Radio, 
  Save, 
  RefreshCw,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function SettingsPage() {
  const { addToast } = useDealSync();
  const [syncFrequency, setSyncFrequency] = useState('realtime');
  const [conflictPolicy, setConflictPolicy] = useState('radar');
  const [auditRetention, setAuditRetention] = useState('90');
  const [webhookSecret, setWebhookSecret] = useState('whsec_fastn_live_a98f129c78d0e');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Settings Saved', 'Workspace synchronization rules updated.');
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Settings & Platform Configuration
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              Workspace Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure synchronization intervals, conflict arbitration thresholds, webhook security, and audit retention policies.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Synchronization Frequency */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              <span>Synchronization Trigger Mode</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label className={`p-4 rounded-xl border cursor-pointer transition-all ${syncFrequency === 'realtime' ? 'bg-indigo-600/15 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <input
                  type="radio"
                  name="syncFreq"
                  value="realtime"
                  checked={syncFrequency === 'realtime'}
                  onChange={(e) => setSyncFrequency(e.target.value)}
                  className="sr-only"
                />
                <span className="font-bold block text-sm mb-1 text-white">Event-Driven Realtime</span>
                <span className="text-[11px] leading-relaxed">Instant webhook processing via Fastn broker (&lt;20ms latency).</span>
              </label>

              <label className={`p-4 rounded-xl border cursor-pointer transition-all ${syncFrequency === 'batch5' ? 'bg-indigo-600/15 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <input
                  type="radio"
                  name="syncFreq"
                  value="batch5"
                  checked={syncFrequency === 'batch5'}
                  onChange={(e) => setSyncFrequency(e.target.value)}
                  className="sr-only"
                />
                <span className="font-bold block text-sm mb-1 text-white">5-Minute Micro-Batch</span>
                <span className="text-[11px] leading-relaxed">Collates bulk changes before dispatching to prevent API rate-limits.</span>
              </label>

              <label className={`p-4 rounded-xl border cursor-pointer transition-all ${syncFrequency === 'hourly' ? 'bg-indigo-600/15 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <input
                  type="radio"
                  name="syncFreq"
                  value="hourly"
                  checked={syncFrequency === 'hourly'}
                  onChange={(e) => setSyncFrequency(e.target.value)}
                  className="sr-only"
                />
                <span className="font-bold block text-sm mb-1 text-white">Hourly Reconciliation</span>
                <span className="text-[11px] leading-relaxed">Scheduled full-parity audit across all mapped deal properties.</span>
              </label>
            </div>
          </div>

          {/* Section 2: Conflict Radar Policies */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Conflict Radar Arbitration Policy</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="conflictPolicy"
                  value="radar"
                  checked={conflictPolicy === 'radar'}
                  onChange={(e) => setConflictPolicy(e.target.value)}
                  className="mt-1 text-indigo-600 focus:ring-0"
                />
                <div>
                  <span className="text-white font-semibold block">Quarantine & Alert (Recommended)</span>
                  <span className="text-slate-400 text-[11px]">
                    Freeze conflicting properties in both HubSpot and Notion until an operator reviews side-by-side diff in Conflict Radar.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="conflictPolicy"
                  value="hubspot_master"
                  checked={conflictPolicy === 'hubspot_master'}
                  onChange={(e) => setConflictPolicy(e.target.value)}
                  className="mt-1 text-indigo-600 focus:ring-0"
                />
                <div>
                  <span className="text-white font-semibold block">HubSpot Master Authority</span>
                  <span className="text-slate-400 text-[11px]">
                    HubSpot CRM changes automatically overwrite Notion in case of collision, with an audit log notification.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="conflictPolicy"
                  value="notion_master"
                  checked={conflictPolicy === 'notion_master'}
                  onChange={(e) => setConflictPolicy(e.target.value)}
                  className="mt-1 text-indigo-600 focus:ring-0"
                />
                <div>
                  <span className="text-white font-semibold block">Notion Workspace Master Authority</span>
                  <span className="text-slate-400 text-[11px]">
                    Notion changes take precedence over CRM fields with automatic back-propagation.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Webhook Security & HMAC Secret */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Key className="w-4 h-4 text-sky-400" />
              <span>Fastn Webhook Security & HMAC Verification</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">HMAC Signing Secret</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => addToast('info', 'Secret Regenerated', 'New HMAC-SHA256 signing secret generated.')}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Regenerate
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  All inbound HubSpot and Notion events are verified against this SHA-256 signature before processing.
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Audit Retention */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Audit Log Retention & Compliance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {['30', '90', '365'].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setAuditRetention(days)}
                  className={`p-3 rounded-xl border font-semibold text-center transition-all ${
                    auditRetention === days
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {days} Days Retention
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
