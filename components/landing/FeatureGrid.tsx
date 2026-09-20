'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeftRight, 
  ShieldAlert, 
  Radio, 
  Activity, 
  FileText, 
  RefreshCcw,
  ArrowRight
} from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: ArrowLeftRight,
      title: 'Intelligent Two-Way Sync',
      desc: 'Keep mapped deal properties aligned across systems. Bi-directional property change listeners maintain continuous parity between HubSpot deals and Notion database pages.',
      href: '/dashboard/pipeline',
      badge: 'Core Engine'
    },
    {
      icon: ShieldAlert,
      title: 'Duplicate Prevention',
      desc: 'Use stable CRM identifiers to avoid creating duplicate pages. Fastn indexes HubSpot Deal UUIDs directly inside Notion metadata, guaranteeing idempotency even during repeated webhooks.',
      href: '/dashboard/pipeline',
      badge: 'Zero-Duplication'
    },
    {
      icon: Radio,
      title: 'Conflict Radar',
      desc: 'Identify conflicting edits and present resolution options. When sales reps and delivery leads make concurrent edits, Conflict Radar isolates discrepancies for human-in-the-loop review.',
      href: '/dashboard/conflicts',
      badge: 'Signature Feature'
    },
    {
      icon: Activity,
      title: 'Sync Health',
      desc: 'Understand synchronization status, errors, and retries. Real-time telemetry tracks API latency, webhook status, schema compatibility, and failure rates across all connected endpoints.',
      href: '/dashboard',
      badge: 'Live Telemetry'
    },
    {
      icon: FileText,
      title: 'Complete Audit Trail',
      desc: 'See which records changed, when, and in which direction. Every sync event, deduplication check, and conflict resolution is committed to an immutable, queryable audit log.',
      href: '/dashboard/activity',
      badge: 'Compliance Ready'
    },
    {
      icon: RefreshCcw,
      title: 'Safe Recovery',
      desc: 'Retry failed operations without creating duplicate records. Dead-letter queues allow instant replaying of failed transactions with original idempotency signatures.',
      href: '/dashboard/activity',
      badge: 'Fault Resilient'
    }
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-[#090d16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Platform Capabilities
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for enterprise revenue integrity.
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Eliminate sync blindspots with deterministic change detection, automated deduplication, and intelligent conflict mediation.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group hover:bg-slate-900/80"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{feat.title}</h3>
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{feat.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={feat.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Inspect feature in app</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
