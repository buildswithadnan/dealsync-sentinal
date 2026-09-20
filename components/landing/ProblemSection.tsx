'use client';

import React from 'react';
import { CopyX, GitCompare, EyeOff, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: CopyX,
      title: 'Duplicate Records',
      subtitle: 'The same deal appears multiple times across tools.',
      description:
        'When sales reps create deals in HubSpot and account managers create pages in Notion, uncoordinated webhooks create duplicate rows, splintering notes, task trackers, and revenue forecasts.',
      impact: 'Reps waste 4.2 hours/week de-duplicating pipeline records manually.',
      border: 'border-rose-500/20 hover:border-rose-500/40',
      badge: 'Data Hygiene Hazard'
    },
    {
      icon: GitCompare,
      title: 'Conflicting Updates',
      subtitle: 'Two teams update the same deal, and one overwrites the other.',
      description:
        'A HubSpot sales rep updates a deal value to $120k during negotiations, while a Notion solutions architect logs a $115k scoped proposal. Naive webhooks silently wipe out critical context with last-write-wins.',
      impact: 'Blind overwrites trigger inaccurate quotes and commission disputes.',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      badge: 'Revenue Risk'
    },
    {
      icon: EyeOff,
      title: 'Invisible Sync Failures',
      subtitle: 'Teams assume data is synchronized when it is not.',
      description:
        'Rate limits, expired API tokens, or schema changes break integrations silently without alerting anyone. Teams continue working under the false assumption that both systems are in parity.',
      impact: 'Sync outages go undetected for days until revenue reviews expose them.',
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      badge: 'Silent Failure'
    }
  ];

  return (
    <section id="product" className="py-20 sm:py-28 bg-[#090d16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            The Multi-Workspace Friction
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your deal data shouldn't live in silos.
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Revenue teams rely on HubSpot for CRM stages and Notion for project delivery. Without continuous identity resolution and conflict arbitration, silos break down pipeline trust.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-slate-900/50 border ${prob.border} transition-all duration-300 hover:bg-slate-900/80 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-200 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {prob.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{prob.title}</h3>
                  <p className="text-xs font-semibold text-slate-300 mt-1">{prob.subtitle}</p>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">{prob.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <strong className="text-slate-300 font-semibold">Impact: </strong>
                  {prob.impact}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
