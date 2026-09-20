'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useDealSync } from '@/context/DealSyncContext';
import { 
  PlayCircle, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Radio, 
  History, 
  GitFork, 
  Layers, 
  ShieldCheck, 
  Clock, 
  FileText,
  Zap,
  Check,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export default function DemoCenterPage() {
  const { 
    scenarios, 
    activeScenarioId, 
    isScenarioRunning, 
    runScenario, 
    resetDemoData, 
    metrics, 
    auditLogs,
    addToast 
  } = useDealSync();

  const [executingAll, setExecutingAll] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  const handleRunAllScenarios = async () => {
    setExecutingAll(true);
    addToast('info', 'Executing Scenarios', 'Running all 6 hackathon demo scenarios sequentially...');
    for (let i = 1; i <= 6; i++) {
      await runScenario(i);
      await new Promise(res => setTimeout(res, 800));
    }
    setExecutingAll(false);
    addToast('success', 'Demo Suite Completed', 'All 6 scenarios verified! Inspect results in Pipeline & Audit Log.');
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                <PlayCircle className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Interactive Demo Center
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Hackathon Judge Sandbox
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Deterministic, repeatable test harness demonstrating real-time synchronization, deduplication, conflict arbitration, and disaster recovery.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetDemoData}
              disabled={isScenarioRunning || executingAll}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Demo State</span>
            </button>

            <button
              onClick={handleRunAllScenarios}
              disabled={isScenarioRunning || executingAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 hover:scale-[1.02]"
            >
              <Play className={`w-3.5 h-3.5 ${executingAll ? 'animate-spin' : ''}`} />
              <span>{executingAll ? 'Executing Suite...' : 'Run All 6 Scenarios'}</span>
            </button>
          </div>
        </div>

        {/* 3-Minute Hackathon Demo Guide & Script Drawer */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Recommended 3-Minute Hackathon Presentation Script
              </h3>
            </div>
            <span className="text-xs font-mono text-indigo-300">Fastn Hackathon 2026</span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono text-indigo-400 font-bold block">0:00 - 0:30 • Context</span>
              <p className="font-semibold text-white mt-1">Open Landing Page & Overview</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Demonstrate multi-tool deal friction: HubSpot for sales CRM, Notion for project delivery.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono text-indigo-400 font-bold block">0:30 - 1:20 • Ingestion</span>
              <p className="font-semibold text-white mt-1">Run Scenario 1 & 2</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Show new deal creation and in-place property updates without generating duplicate rows.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/20 bg-amber-500/5">
              <span className="text-[10px] font-mono text-amber-400 font-bold block">1:20 - 2:20 • Conflict Radar</span>
              <p className="font-semibold text-amber-200 mt-1">Run Scenario 4 & 5</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Trigger simultaneous conflicting edits and resolve with single-click authoritative propagation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono text-indigo-400 font-bold block">2:20 - 3:00 • Resilience</span>
              <p className="font-semibold text-white mt-1">Run Scenario 6 & Audit Trail</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Simulate destination rate limit and demonstrate one-click safe replay with idempotency.
              </p>
            </div>
          </div>
        </div>

        {/* 6 Interactive Scenario Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Autonomous Demonstration Scenarios
            </h3>
            <span className="text-xs text-slate-400">
              Click any scenario to execute live state transitions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scenarios.map((sc) => {
              const isRunning = activeScenarioId === sc.id && isScenarioRunning;
              return (
                <div
                  key={sc.id}
                  className={`p-5 rounded-2xl bg-slate-900/70 border transition-all duration-300 flex flex-col justify-between ${
                    sc.isCompleted
                      ? 'border-emerald-500/40 shadow-sm shadow-emerald-500/5'
                      : isRunning
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                        Scenario {sc.scenarioNumber}
                      </span>
                      {sc.isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">
                          {sc.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white tracking-tight">{sc.title}</h4>
                    <p className="text-xs font-semibold text-slate-300 mt-0.5">{sc.subtitle}</p>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{sc.description}</p>

                    {/* Expected Outcome Pill */}
                    <div className="mt-4 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px]">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase block mb-0.5">
                        Expected Outcome:
                      </span>
                      <span className="text-slate-300">{sc.expectedResult}</span>
                    </div>
                  </div>

                  {/* Trigger Button */}
                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      State: {sc.isCompleted ? 'Committed' : 'Ready'}
                    </span>
                    <button
                      onClick={() => runScenario(sc.scenarioNumber)}
                      disabled={isScenarioRunning || executingAll}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-all disabled:opacity-50"
                    >
                      <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
                      <span>{isRunning ? 'Running...' : 'Run Scenario'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Execution Output Terminal */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-slate-200">Fastn Live Event Bus Monitor</span>
            </div>
            <span className="text-slate-500">Real-time telemetry stream</span>
          </div>

          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 text-[11px] text-slate-300">
                <span className="text-slate-500 select-none">›</span>
                <span className="text-slate-500 whitespace-nowrap">[{log.timestamp}]</span>
                <span
                  className={`font-semibold uppercase ${
                    log.result === 'success'
                      ? 'text-emerald-400'
                      : log.result === 'conflict'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  [{log.operation}]
                </span>
                <span className="text-white font-medium">{log.dealName}:</span>
                <span className="text-slate-400">{log.details}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
