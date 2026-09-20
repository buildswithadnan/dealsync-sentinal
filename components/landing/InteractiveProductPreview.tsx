'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDealSync } from '@/context/DealSyncContext';
import { 
  GitFork, 
  Radio, 
  History, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  ShieldCheck,
  Layers
} from 'lucide-react';

export const InteractiveProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'conflicts' | 'activity' | 'architecture'>('pipeline');
  const { deals, conflicts, auditLogs, resolveConflict } = useDealSync();

  return (
    <section id="interactive-preview" className="py-20 sm:py-28 bg-[#090d16] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Interactive Product Preview
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore the live interface right here.
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Click across the core modules to preview how DealSync Sentinel renders synchronized deals, isolates conflicting updates, and records immutable audit telemetry.
          </p>
        </div>

        {/* Interactive App Window Container */}
        <div className="mt-12 rounded-2xl bg-[#0c121e] border border-slate-800 shadow-2xl overflow-hidden">
          {/* Tabs Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-4 py-3 bg-[#090d16] gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'pipeline'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Pipeline View</span>
              </button>

              <button
                onClick={() => setActiveTab('conflicts')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'conflicts'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>Conflict Radar</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                  {conflicts.filter(c => c.status === 'unresolved').length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('activity')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'activity'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Sync Activity</span>
              </button>

              <button
                onClick={() => setActiveTab('architecture')}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'architecture'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Architecture Blueprint</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                Mode: Live Interactive Demo
              </span>
              <Link
                href={
                  activeTab === 'pipeline'
                    ? '/dashboard/pipeline'
                    : activeTab === 'conflicts'
                    ? '/dashboard/conflicts'
                    : '/dashboard/activity'
                }
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                <span>Open Full Page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="p-4 sm:p-6 min-h-[380px]">
            {/* Tab 1: Pipeline */}
            {activeTab === 'pipeline' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">HubSpot ↔ Notion Synchronized Deals</h3>
                    <p className="text-xs text-slate-400">Showing 6 of {deals.length} deals mapped across systems</p>
                  </div>
                  <Link
                    href="/dashboard/pipeline"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View all {deals.length} deals →
                  </Link>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Deal Name</th>
                        <th className="py-2.5 px-3">Company</th>
                        <th className="py-2.5 px-3">Stage</th>
                        <th className="py-2.5 px-3">Value</th>
                        <th className="py-2.5 px-3">HubSpot ID</th>
                        <th className="py-2.5 px-3">Notion Page</th>
                        <th className="py-2.5 px-3 text-right">Sync State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {deals.slice(0, 6).map((deal) => (
                        <tr key={deal.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-white">{deal.name}</td>
                          <td className="py-2.5 px-3 text-slate-400">{deal.company}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[11px]">
                              {deal.stage}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-medium text-emerald-400">
                            ${deal.amount.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{deal.hubspotId}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{deal.notionPageId}</td>
                          <td className="py-2.5 px-3 text-right">
                            {deal.syncStatus === 'In Sync' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                In Sync
                              </span>
                            ) : deal.syncStatus === 'Conflict' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                                <AlertTriangle className="w-3 h-3" />
                                Conflict
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">{deal.syncStatus}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Conflict Radar */}
            {activeTab === 'conflicts' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Active Conflict Radar Queue</h3>
                    <p className="text-xs text-slate-400">
                      Discrepancies detected between HubSpot CRM and Notion workspace
                    </p>
                  </div>
                  <Link
                    href="/dashboard/conflicts"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Open Resolution Center →
                  </Link>
                </div>

                <div className="space-y-4">
                  {conflicts.map((conflict) => (
                    <div
                      key={conflict.id}
                      className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {conflict.severity}
                          </span>
                          <h4 className="text-sm font-bold text-white">{conflict.dealName}</h4>
                          <span className="text-xs text-slate-400">({conflict.company})</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Field in dispute: <strong className="text-amber-300">{conflict.fieldLabel}</strong>
                        </p>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono">
                          <div className="p-2 rounded bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Baseline Value:</span>
                            <span className="text-slate-300 font-semibold">{conflict.lastSyncedValue}</span>
                          </div>
                          <div className="p-2 rounded bg-orange-950/20 border border-orange-500/30">
                            <span className="text-[10px] text-orange-400 block">HubSpot Side:</span>
                            <span className="text-orange-300 font-bold">{conflict.hubspotValue}</span>
                          </div>
                          <div className="p-2 rounded bg-slate-800/40 border border-slate-700">
                            <span className="text-[10px] text-slate-400 block">Notion Side:</span>
                            <span className="text-slate-200 font-bold">{conflict.notionValue}</span>
                          </div>
                        </div>
                      </div>

                      {conflict.status === 'unresolved' ? (
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => resolveConflict(conflict.id, 'hubspot')}
                            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow transition-all"
                          >
                            Keep HubSpot ({conflict.hubspotValue})
                          </button>
                          <button
                            onClick={() => resolveConflict(conflict.id, 'notion')}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                          >
                            Keep Notion ({conflict.notionValue})
                          </button>
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                          Resolved ({conflict.resolvedValue})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Sync Activity */}
            {activeTab === 'activity' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">Fastn Immutable Audit Telemetry</h3>
                    <p className="text-xs text-slate-400">Real-time trace of synchronization operations</p>
                  </div>
                  <Link
                    href="/dashboard/activity"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View Full Audit Log →
                  </Link>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400">{log.timestamp}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            log.result === 'success'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : log.result === 'conflict'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {log.operation}
                        </span>
                        <span className="text-white font-semibold">{log.dealName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{log.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Architecture Blueprint */}
            {activeTab === 'architecture' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">High-Fidelity Platform & Diff Architecture</h3>
                    <p className="text-xs text-slate-400">Detailed schematic of Conflict Radar side-by-side reconciliation</p>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/30">
                    Resolution Engine v4.2
                  </span>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
                  <img
                    src="/assets/deal_sync_radar_preview.jpg"
                    alt="DealSync Sentinel Conflict Radar Architecture"
                    className="w-full h-auto object-cover rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                  <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Deterministic Three-Way Merge Engine with SHA-256 Idempotency verification</span>
                    </div>
                    <Link
                      href="/dashboard/conflicts"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      <span>Try Conflict Radar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
