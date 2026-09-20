'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Link2, 
  SplitSquareVertical, 
  RefreshCw, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      stepNumber: '01',
      title: 'Connect',
      subtitle: 'Connect HubSpot and Notion',
      desc: 'Authorize HubSpot CRM and your Notion workspace with a single OAuth grant. Fastn configures bi-directional webhooks and verifies permission boundaries.',
      icon: Link2,
      bulletPoints: [
        'Read & write access for HubSpot Deals',
        'Notion parent page & database selection',
        'Cryptographic HMAC webhook secret generation'
      ],
      previewSnippet: {
        system1: 'HubSpot CRM OAuth: Authorized',
        system2: 'Notion Database: "Enterprise Deals Pipeline"',
        status: 'Connected & Verified'
      }
    },
    {
      stepNumber: '02',
      title: 'Map',
      subtitle: 'Select the deal fields to synchronize',
      desc: 'Define custom or standard property mappings between CRM deals and Notion databases with type validation (Currency, Multi-select, Date, Relations).',
      icon: SplitSquareVertical,
      bulletPoints: [
        'Deal Name ↔ Notion Title',
        'Deal Amount ↔ Number ($ USD)',
        'Pipeline Stage ↔ Select Status',
        'Account Executive ↔ Person'
      ],
      previewSnippet: {
        system1: '6 Standard properties mapped',
        system2: 'Two-way sync active on 5 fields',
        status: 'Schema validated'
      }
    },
    {
      stepNumber: '03',
      title: 'Synchronize',
      subtitle: 'Fastn processes events and creates or updates matching records',
      desc: 'When deals update, Fastn processes change payloads, calculates checksums, and updates target records within milliseconds—preventing duplicates.',
      icon: RefreshCw,
      bulletPoints: [
        'Average sync latency under 18ms',
        'Zero-touch Notion record generation',
        'Automatic deduplication using CRM UUID'
      ],
      previewSnippet: {
        system1: 'Processed: 1,420 events today',
        system2: 'Deduplicated: 18 repeated webhooks',
        status: '100% Delivery Rate'
      }
    },
    {
      stepNumber: '04',
      title: 'Resolve',
      subtitle: 'Detect conflicts, review changes, and track outcomes',
      desc: 'If contradictory updates happen simultaneously, Conflict Radar isolates the discrepancy and empowers your ops team to resolve with a single click.',
      icon: CheckCircle,
      bulletPoints: [
        'Three-way comparison: Base vs HubSpot vs Notion',
        'Keep HubSpot, Keep Notion, or Smart Merge',
        'Every decision recorded into audit log'
      ],
      previewSnippet: {
        system1: 'Conflict: Enterprise Cloud Migration',
        system2: 'Delta: $120,000 vs $115,000',
        status: 'Awaiting Operator Selection'
      }
    }
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#0c121e] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Four-Step Architecture
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How DealSync Sentinel Works
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            From initial authentication to active conflict arbitration, here is how continuous parity is maintained between HubSpot and Notion.
          </p>
        </div>

        {/* Step Tabs */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500/50 shadow-md shadow-indigo-600/10'
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`}>
                    Step {step.stepNumber}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                </div>
                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 truncate">{step.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-3">
                <span>Phase {steps[activeStep].stepNumber}</span>
                <span>•</span>
                <span>{steps[activeStep].title}</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {steps[activeStep].subtitle}
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {steps[activeStep].desc}
              </p>

              <div className="mt-6 space-y-2.5">
                {steps[activeStep].bulletPoints.map((pt, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual preview card */}
            <div className="lg:col-span-5">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-[11px]">
                  <span>Telemetry State</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>
                <div className="mt-4 space-y-2.5 text-slate-300">
                  <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Primary Parameter:</span>
                    <span className="text-white font-semibold">{steps[activeStep].previewSnippet.system1}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Target Binding:</span>
                    <span className="text-white font-semibold">{steps[activeStep].previewSnippet.system2}</span>
                  </div>
                  <div className="p-2.5 rounded bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-between">
                    <span className="text-[10px]">Verification:</span>
                    <span className="font-semibold">{steps[activeStep].previewSnippet.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
