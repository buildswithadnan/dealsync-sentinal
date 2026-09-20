'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  Radio, 
  Zap,
  ArrowLeftRight
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-sky-500/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Every Deal. Every Update. Always in Sync.</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Fastn Hackathon 2026</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Your CRM and workspace.{' '}
          <span className="gradient-accent-text block sm:inline">Finally in sync.</span>
        </h1>

        {/* Supporting text */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          DealSync Sentinel keeps HubSpot and Notion aligned, prevents duplicate records, and catches conflicting deal updates before they become costly mistakes.
        </p>

        {/* Dual CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard/demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4 text-indigo-200" />
            <span>Launch Live Demo</span>
            <ArrowRight className="w-4 h-4 text-white/70" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm hover:text-white transition-all"
          >
            <span>Explore the Platform</span>
          </Link>
        </div>

        {/* Realistic Interactive Product Preview Mockup */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          {/* Outer glow container */}
          <div className="relative rounded-2xl bg-[#0c121e] border border-slate-800/90 shadow-2xl overflow-hidden text-left">
            {/* Mock Window Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#090d16] border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-xs font-mono text-slate-400">dealsync-sentinel // live-sync-orchestrator</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  DEMO DATASET
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Integration Flow Header: HubSpot → Fastn → Notion */}
            <div className="p-6 bg-gradient-to-b from-slate-900/90 to-[#0c121e] border-b border-slate-800/60">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* HubSpot Node */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-orange-500/20 shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
                    <span className="text-orange-400 font-bold text-base">HS</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">HubSpot CRM</h4>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">Object: Deals (Pipeline)</p>
                  </div>
                </div>

                {/* Fastn Orchestrator Node */}
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 shadow-sm flex items-center justify-between relative">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Fastn Engine</h4>
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 text-[9px] text-indigo-200">ACTIVE</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Idempotency & Diff Engine</p>
                    </div>
                  </div>
                  <ArrowLeftRight className="w-4 h-4 text-indigo-400/70" />
                </div>

                {/* Notion Node */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0">
                    <span className="text-slate-200 font-bold text-base">N</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notion Workspace</h4>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">Db: Enterprise Deals Pipeline</p>
                  </div>
                </div>
              </div>

              {/* 4 Required Metric Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium block">Synchronized Deals</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-lg font-bold text-emerald-400">24</span>
                    <span className="text-xs text-slate-400 font-normal">deals</span>
                  </div>
                  <span className="text-[10px] text-emerald-500/90 font-medium">100% field parity</span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium block">Duplicate Records</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-lg font-bold text-white">0</span>
                    <span className="text-xs text-slate-400 font-normal">in dataset</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-medium">Deduplicated via UUID</span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                  <span className="text-[11px] text-amber-300/90 font-medium block">Conflicts Requiring Review</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-lg font-bold text-amber-400">2</span>
                    <span className="text-xs text-slate-400 font-normal">flagged</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-medium">Conflict Radar active</span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium block">Last Sync Timestamp</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-bold text-slate-200">Just now</span>
                  </div>
                  <span className="text-[10px] text-slate-400">14ms Fastn pipeline latency</span>
                </div>
              </div>
            </div>

            {/* Quick Live Preview Snippet */}
            <div className="p-4 bg-slate-950/50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Active Conflict: <strong className="text-white">Enterprise Cloud Migration</strong> ($120,000 HubSpot vs $115,000 Notion)</span>
              </div>
              <Link
                href="/dashboard/conflicts"
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <span>Inspect in Conflict Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
