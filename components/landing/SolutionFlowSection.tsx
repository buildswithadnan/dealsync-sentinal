'use client';

import React from 'react';
import { 
  ArrowRight, 
  Zap, 
  Fingerprint, 
  Database, 
  FileCheck2, 
  ArrowLeftRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const SolutionFlowSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'HubSpot Deal Event',
      desc: 'Inbound webhook emitted on deal.create or propertyChange with CRM UUID.',
      icon: Zap,
      accent: 'border-orange-500/30 text-orange-400 bg-orange-500/10'
    },
    {
      num: '02',
      title: 'Fastn Workflow Router',
      desc: 'High-throughput orchestration layer extracts payload and verifies cryptographic signatures.',
      icon: ArrowLeftRight,
      accent: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
    },
    {
      num: '03',
      title: 'Identity & Change Detection',
      desc: 'SHA-256 state hashing eliminates duplicates and flags concurrent three-way conflicts.',
      icon: Fingerprint,
      accent: 'border-sky-500/30 text-sky-400 bg-sky-500/10'
    },
    {
      num: '04',
      title: 'Notion Create / Update',
      desc: 'Idempotent write safely commits mapped properties to the Notion database.',
      icon: Database,
      accent: 'border-slate-400/30 text-slate-300 bg-slate-800'
    },
    {
      num: '05',
      title: 'Audit Log & Telemetry',
      desc: 'Bidirectional transaction hash recorded into immutable audit trail with replay capability.',
      icon: FileCheck2,
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#0c121e] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
            Intelligent Orchestration
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            One source of truth. Two connected workspaces.
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            DealSync Sentinel orchestrates a continuous, state-aware pipeline between HubSpot and Notion powered by Fastn. Every write is verified, deduplicated, and audited.
          </p>
        </div>

        {/* Visual Pipeline Flow Diagram */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative group">
                <div className="h-full p-5 rounded-xl bg-slate-900/80 border border-slate-800 group-hover:border-indigo-500/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-slate-400">{step.num}</span>
                      <div className={`w-8 h-8 rounded-lg ${step.accent} flex items-center justify-center border`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{step.title}</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{step.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Verified Step</span>
                  </div>
                </div>

                {/* Arrow connector between steps on desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reverse-Sync Path Indicator Card */}
        <div className="mt-10 p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Full Reverse-Sync Channel Supported
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Edits made within Notion pages flow back into HubSpot CRM via Fastn webhook listener with identical conflict protection.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
            Bidirectional Guard: ACTIVE
          </span>
        </div>
      </div>
    </section>
  );
};
