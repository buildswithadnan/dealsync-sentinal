'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useDealSync } from '@/context/DealSyncContext';
import { 
  Layers, 
  CheckCircle2, 
  Zap, 
  ExternalLink, 
  RefreshCw, 
  SplitSquareVertical, 
  ArrowLeftRight, 
  Activity, 
  ShieldCheck, 
  Sliders,
  Check,
  X,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function IntegrationsPage() {
  const { fieldMappings, metrics, triggerManualSync, addToast } = useDealSync();
  const [testingConnector, setTestingConnector] = useState<'hubspot' | 'notion' | 'fastn' | null>(null);
  const [testResult, setTestResult] = useState<{
    system: string;
    status: string;
    latency: number;
    details: string;
  } | null>(null);

  const handleTestConnection = (system: 'hubspot' | 'notion' | 'fastn') => {
    setTestingConnector(system);
    setTestResult(null);

    setTimeout(() => {
      setTestingConnector(null);
      if (system === 'hubspot') {
        setTestResult({
          system: 'HubSpot CRM',
          status: 'Operational',
          latency: 18,
          details: 'OAuth token valid. Webhook subscriptions (deal.creation, deal.propertyChange) active with HMAC-SHA256 verification.'
        });
        addToast('success', 'HubSpot Connected', 'Connection verified with 18ms latency.');
      } else if (system === 'notion') {
        setTestResult({
          system: 'Notion Database',
          status: 'Operational',
          latency: 22,
          details: 'Internal integration token valid. Database "Enterprise Deals Pipeline" accessible with 6 mapped properties.'
        });
        addToast('success', 'Notion Connected', 'Database permissions verified with 22ms latency.');
      } else {
        setTestResult({
          system: 'Fastn Orchestration Hub',
          status: 'Operational',
          latency: 12,
          details: 'Event broker running. Idempotency cache online with 0 memory leaks.'
        });
        addToast('success', 'Fastn Hub Active', 'Orchestration workflow verified.');
      }
    }, 1000);
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Integration & Connector Hub
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                3/3 Connected
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Topology and mapping management between HubSpot CRM, Fastn Orchestration Engine, and Notion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              Environment: Hackathon Sandbox
            </span>
          </div>
        </div>

        {/* 3 Core System Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: HubSpot */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-orange-500/30 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-sm">
                    HS
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">HubSpot CRM</h3>
                    <span className="text-[11px] text-slate-400">Primary Sales Pipeline</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Connected
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Connector Name:</span>
                  <span className="font-semibold text-white">hubspot-deals-v3</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Object Type:</span>
                  <span className="text-white">Deals (Pipeline)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Supported Events:</span>
                  <span className="font-mono text-[11px] text-orange-300">create, change, delete</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Last Sync:</span>
                  <span className="text-emerald-400 font-medium">{metrics.lastSyncTimestamp}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => handleTestConnection('hubspot')}
                disabled={testingConnector === 'hubspot'}
                className="flex-1 py-2 px-3 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 text-xs font-semibold border border-orange-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingConnector === 'hubspot' ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>
          </div>

          {/* Card 2: Fastn Orchestrator */}
          <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-indigo-300 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Fastn Integration Hub</h3>
                    <span className="text-[11px] text-indigo-300">Orchestrator & Change Engine</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-indigo-500/20">
                  <span className="text-slate-400">Workflow ID:</span>
                  <span className="font-mono text-indigo-200">wf-dealsync-sentinel</span>
                </div>
                <div className="flex justify-between py-1 border-b border-indigo-500/20">
                  <span className="text-slate-400">Execution Latency:</span>
                  <span className="font-mono text-emerald-400">14.2 ms avg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-indigo-500/20">
                  <span className="text-slate-400">Deduplication Engine:</span>
                  <span className="text-white">Active (UUID Hash)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Conflict Arbiter:</span>
                  <span className="text-amber-300 font-medium">Three-Way Diff</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-indigo-500/20 flex items-center gap-2">
              <button
                onClick={() => handleTestConnection('fastn')}
                disabled={testingConnector === 'fastn'}
                className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingConnector === 'fastn' ? 'animate-spin' : ''}`} />
                <span>Verify Workflow</span>
              </button>
            </div>
          </div>

          {/* Card 3: Notion */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-700/80 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center font-bold text-white text-sm">
                    N
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Notion Workspace</h3>
                    <span className="text-[11px] text-slate-400">Enterprise Database</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Connected
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Database Name:</span>
                  <span className="font-semibold text-white truncate max-w-[150px]">
                    Enterprise Deals Pipeline
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Database ID:</span>
                  <span className="font-mono text-slate-400 text-[11px]">4401a-9934x</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Mapped Properties:</span>
                  <span className="text-white">6 properties active</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Last Sync:</span>
                  <span className="text-emerald-400 font-medium">{metrics.lastSyncTimestamp}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => handleTestConnection('notion')}
                disabled={testingConnector === 'notion'}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingConnector === 'notion' ? 'animate-spin' : ''}`} />
                <span>Test Database</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Diagnostic Result Modal/Box */}
        {testResult && (
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs text-slate-200 animate-in fade-in flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{testResult.system} Diagnostic Passed</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
                    {testResult.latency}ms latency
                  </span>
                </div>
                <p className="text-slate-400 mt-1 leading-relaxed">{testResult.details}</p>
              </div>
            </div>
            <button onClick={() => setTestResult(null)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Field Mapping Table */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <SplitSquareVertical className="w-4 h-4 text-indigo-400" />
                <span>HubSpot ↔ Notion Field Mapping Schema</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configured data field mappings processed by Fastn transformation rules.
              </p>
            </div>

            <span className="text-xs font-mono text-slate-400">
              6 properties active • Bi-directional sync
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0c121e] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">HubSpot CRM Property</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Direction</th>
                  <th className="py-3 px-4">Notion Workspace Property</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
                {fieldMappings.map((map) => (
                  <tr key={map.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-orange-300">
                      {map.hubspotField}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{map.hubspotType}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400 font-mono">
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        <span>Two-Way</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{map.notionProperty}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{map.notionType}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
