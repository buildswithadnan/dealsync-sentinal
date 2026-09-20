'use client';

import React from 'react';
import { Layers, Zap, ArrowLeftRight, Shield } from 'lucide-react';

export const IntegrationStrip: React.FC = () => {
  return (
    <section className="py-12 border-y border-slate-800/80 bg-[#090d16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
          The Continuous Synchronization Ecosystem
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          {/* HubSpot */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#ff7a59]/15 border border-[#ff7a59]/30 flex items-center justify-center font-bold text-[#ff7a59] text-sm">
              HS
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-white block">HubSpot CRM</span>
              <span className="text-[10px] text-slate-400">Deals & Pipelines API</span>
            </div>
          </div>

          {/* Connected Icon */}
          <div className="hidden sm:flex items-center text-slate-600">
            <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
          </div>

          {/* Fastn */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 shadow-sm shadow-indigo-500/10">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-300" />
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-white block">Fastn Integration Hub</span>
              <span className="text-[10px] text-indigo-300">Orchestrator & Change Engine</span>
            </div>
          </div>

          {/* Connected Icon */}
          <div className="hidden sm:flex items-center text-slate-600">
            <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
          </div>

          {/* Notion */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-sm">
              N
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-white block">Notion Workspace</span>
              <span className="text-[10px] text-slate-400">Database & Relations API</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-6 max-w-md mx-auto">
          Demonstration project built for the integration hackathon. Integrates via standard REST APIs & Webhooks. Not an official endorsement.
        </p>
      </div>
    </section>
  );
};
