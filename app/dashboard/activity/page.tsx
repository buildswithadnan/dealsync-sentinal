'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useDealSync } from '@/context/DealSyncContext';
import { SyncEvent, SyncOperation } from '@/types/dealsync';
import { 
  History, 
  Search, 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Code, 
  ExternalLink,
  Zap,
  ArrowLeftRight
} from 'lucide-react';

export default function ActivityPage() {
  const { auditLogs, replayFailedEvent, addToast } = useDealSync();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOperation, setSelectedOperation] = useState<string>('All');
  const [activeEvent, setActiveEvent] = useState<SyncEvent | null>(null);

  const filterOptions = [
    { label: 'All Events', value: 'All' },
    { label: 'Created', value: 'create' },
    { label: 'Updated', value: 'update' },
    { label: 'No Change (Deduplicated)', value: 'deduplicate' },
    { label: 'Conflict', value: 'conflict_detected' },
    { label: 'Failed', value: 'failed' },
    { label: 'Retried', value: 'retried' }
  ];

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.dealName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.idempotencyKey.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesOp = true;
      if (selectedOperation !== 'All') {
        if (selectedOperation === 'conflict_detected') {
          matchesOp = log.operation === 'conflict_detected' || log.operation === 'conflict_resolved';
        } else {
          matchesOp = log.operation === selectedOperation;
        }
      }
      return matchesSearch && matchesOp;
    });
  }, [auditLogs, searchQuery, selectedOperation]);

  const handleReplay = (eventId: string) => {
    replayFailedEvent(eventId);
    const updated = auditLogs.find(l => l.id === eventId);
    if (updated) {
      setActiveEvent(updated);
    }
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Sync Activity & Audit Log
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono">
                {auditLogs.length} events committed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Cryptographically hashed, immutable transaction log tracking all creations, updates, deduplications, and conflict resolutions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Event Broker Active</span>
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail by deal name, details, or idempotency hash..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Operation Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Filter:</span>
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedOperation(opt.value)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  selectedOperation === opt.value
                    ? 'bg-indigo-600/25 text-indigo-200 border border-indigo-500/40 shadow-sm'
                    : 'bg-slate-950/40 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0c121e] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Deal</th>
                  <th className="py-3 px-4">Operation</th>
                  <th className="py-3 px-4">Direction</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Engine Version</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No synchronization events match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setActiveEvent(log)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {log.dealName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                          {log.operation}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-400 whitespace-nowrap">
                        {log.direction === 'hubspot_to_notion' ? (
                          <span className="text-orange-300">HubSpot → Notion</span>
                        ) : log.direction === 'notion_to_hubspot' ? (
                          <span className="text-sky-300">Notion → HubSpot</span>
                        ) : log.direction === 'bidirectional' ? (
                          <span className="text-indigo-300">Bidirectional</span>
                        ) : (
                          <span className="text-slate-400">Fastn Engine</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {log.result === 'success' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Success
                          </span>
                        ) : log.result === 'conflict' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Conflict
                          </span>
                        ) : log.result === 'skipped' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                            Deduplicated
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                            <AlertOctagon className="w-3.5 h-3.5" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {log.version}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                        {log.details}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {log.result === 'failed' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReplay(log.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition-all"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Replay</span>
                          </button>
                        ) : (
                          <span className="text-slate-500 group-hover:text-indigo-400 text-xs">
                            Inspect →
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Detail Drawer */}
        {activeEvent && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-lg bg-[#0c121e] border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto h-full shadow-2xl">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                      Audit Event Inspector
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{activeEvent.dealName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Event ID: {activeEvent.id}</p>
                  </div>
                  <button
                    onClick={() => setActiveEvent(null)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Event Properties */}
                <div className="mt-5 space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Timestamp:</span>
                      <span className="font-mono text-white">{activeEvent.timestamp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Operation Type:</span>
                      <span className="font-mono text-indigo-300 uppercase font-semibold">
                        {activeEvent.operation}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Direction:</span>
                      <span className="text-slate-200">{activeEvent.direction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Result Status:</span>
                      <span className="font-semibold text-emerald-400">{activeEvent.result}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Idempotency Key:</span>
                      <span className="font-mono text-[10px] text-slate-300 truncate max-w-[200px]">
                        {activeEvent.idempotencyKey}
                      </span>
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Execution Summary
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">{activeEvent.details}</p>
                  </div>

                  {/* Error Details if Failed */}
                  {activeEvent.errorDetails && (
                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300">
                      <span className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-rose-400">
                        Error Diagnostic Telemetry
                      </span>
                      <p className="font-mono text-[11px]">{activeEvent.errorDetails}</p>
                    </div>
                  )}

                  {/* Changed Fields Payload Diff */}
                  {activeEvent.changedFields && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        State Diff Payload
                      </span>
                      <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto bg-slate-900 p-2.5 rounded border border-slate-800">
                        {JSON.stringify(activeEvent.changedFields, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-slate-800 mt-6 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">{activeEvent.version}</span>
                {activeEvent.result === 'failed' ? (
                  <button
                    onClick={() => handleReplay(activeEvent.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all shadow"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay Failed Event</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveEvent(null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
