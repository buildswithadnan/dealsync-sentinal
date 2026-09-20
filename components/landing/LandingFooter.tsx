'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Zap, ExternalLink } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#070a12] border-t border-slate-800/80 text-slate-400 text-xs">
      {/* Final High-Converting CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-indigo-500/20 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Hackathon Live Demonstration
          </span>

          <h2 className="mt-5 text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Stop chasing updates. Start trusting your pipeline.
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Eliminate duplicate Notion records, catch conflicting CRM edits before they corrupt your data, and audit every change with DealSync Sentinel.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Launch DealSync Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
            >
              <span>Explore Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/80">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">DealSync Sentinel</span>
            </Link>
            <p className="mt-3 text-xs text-slate-400 max-w-sm leading-relaxed">
              AI-powered CRM synchronization, pipeline intelligence, and conflict resolution platform connecting HubSpot and Notion via Fastn.
            </p>
            <p className="mt-4 text-[11px] text-slate-400">
              Built for the Fastn Integration Hackathon.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard/pipeline" className="hover:text-white transition-colors">Pipeline Management</Link></li>
              <li><Link href="/dashboard/conflicts" className="hover:text-white transition-colors">Conflict Radar</Link></li>
              <li><Link href="/dashboard/activity" className="hover:text-white transition-colors">Sync Activity</Link></li>
              <li><Link href="/dashboard/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Demo</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard/demo" className="hover:text-white transition-colors">Interactive Demo Center</Link></li>
              <li><Link href="/dashboard/demo" className="hover:text-white transition-colors">Scenario 1: New Deal</Link></li>
              <li><Link href="/dashboard/demo" className="hover:text-white transition-colors">Scenario 4: Conflict Diff</Link></li>
              <li><Link href="/dashboard/demo" className="hover:text-white transition-colors">Scenario 6: Fail & Retry</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Integrations</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard/integrations" className="hover:text-white transition-colors">HubSpot CRM</Link></li>
              <li><Link href="/dashboard/integrations" className="hover:text-white transition-colors">Fastn Orchestrator</Link></li>
              <li><Link href="/dashboard/integrations" className="hover:text-white transition-colors">Notion Workspace</Link></li>
              <li><Link href="/dashboard/settings" className="hover:text-white transition-colors">Field Mappings</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 DealSync Sentinel. Every Deal. Every Update. Always in Sync.</p>
          <div className="flex items-center gap-4">
            <span>Fastn Integration Hackathon</span>
            <span>•</span>
            <Link href="/dashboard" className="text-indigo-400 hover:underline">
              Enter Production Sandbox
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
