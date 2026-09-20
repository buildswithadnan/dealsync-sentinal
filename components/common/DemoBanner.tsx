'use client';

import React from 'react';
import Link from 'next/link';
import { useDealSync } from '@/context/DealSyncContext';
import { RefreshCw, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { metrics, resetDemoData, isScenarioRunning } = useDealSync();

  return (
    <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-blue-950/80 border-b border-indigo-500/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-semibold tracking-wide text-[11px] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Demo Mode Active
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Interactive Hackathon Sandbox • Simulated HubSpot CRM ↔ Fastn ↔ Notion Database
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Synced Deals: <strong className="text-emerald-400 font-medium">{metrics.syncedDeals}/{metrics.totalDeals}</strong></span>
            <span>•</span>
            <span>Open Conflicts: <strong className="text-amber-400 font-medium">{metrics.openConflicts}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/demo"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 hover:text-white font-medium transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Demo Scenarios</span>
              <ArrowRight className="w-3 h-3 opacity-60" />
            </Link>

            <button
              onClick={resetDemoData}
              disabled={isScenarioRunning}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
              title="Reset dataset back to fresh state"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
