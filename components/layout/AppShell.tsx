'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDealSync } from '@/context/DealSyncContext';
import { DemoBanner } from '@/components/common/DemoBanner';
import { ToastContainer } from '@/components/common/ToastContainer';
import { 
  LayoutDashboard, 
  GitFork, 
  Radio, 
  History, 
  Layers, 
  Settings, 
  PlayCircle, 
  RefreshCw, 
  Menu, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronDown, 
  ExternalLink,
  Zap,
  Building2,
  Bell
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const { metrics, triggerManualSync } = useDealSync();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    triggerManualSync();
    setTimeout(() => setIsSyncing(false), 1200);
  };

  const navItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Pipeline',
      href: '/dashboard/pipeline',
      icon: GitFork,
      badge: `${metrics.totalDeals}`
    },
    {
      name: 'Conflict Radar',
      href: '/dashboard/conflicts',
      icon: Radio,
      badge: metrics.openConflicts > 0 ? `${metrics.openConflicts}` : null,
      badgeColor: metrics.openConflicts > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : undefined,
      pulse: metrics.openConflicts > 0
    },
    {
      name: 'Sync Activity',
      href: '/dashboard/activity',
      icon: History,
      badge: null
    },
    {
      name: 'Integrations',
      href: '/dashboard/integrations',
      icon: Layers,
      badge: '3/3'
    },
    {
      name: 'Demo Center',
      href: '/dashboard/demo',
      icon: PlayCircle,
      badge: 'Scenarios',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Persistent Demo Mode Banner */}
      <DemoBanner />

      {/* Main App Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0c121e] border-r border-slate-800/80 shrink-0">
          {/* Brand Logo Header */}
          <div className="p-5 border-b border-slate-800/80">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-white">DealSync</span>
                  <span className="text-xs font-semibold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">SENTINEL</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">HubSpot ↔ Fastn ↔ Notion</p>
              </div>
            </Link>
          </div>

          {/* Connected Workspace Switcher */}
          <div className="px-4 py-3 border-b border-slate-800/60">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-300 font-semibold text-[10px] shrink-0">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="truncate">
                  <p className="text-white font-medium truncate">Acme Revenue Ops</p>
                  <p className="text-[10px] text-slate-400 truncate">Production Pipeline</p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-200 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'} flex items-center gap-1`}>
                      {item.pulse && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Connector Health Widget */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Connector Health</span>
              <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Operational
              </span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-slate-300 py-1 px-2 rounded bg-slate-900/40 border border-slate-800/50">
                <span className="text-slate-400">HubSpot Deals</span>
                <span className="text-emerald-400 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 py-1 px-2 rounded bg-slate-900/40 border border-slate-800/50">
                <span className="text-slate-400">Notion Database</span>
                <span className="text-emerald-400 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 py-1 px-2 rounded bg-slate-900/40 border border-slate-800/50">
                <span className="text-slate-400">Fastn Engine</span>
                <span className="text-sky-400 font-medium">14ms latency</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold text-xs">
                  AC
                </div>
                <div className="leading-tight">
                  <p className="text-white text-[11px] font-medium">Alex Chen</p>
                  <p className="text-[10px] text-slate-400">Revenue Ops</p>
                </div>
              </div>
              <Link href="/" className="text-slate-400 hover:text-white transition-colors" title="View Landing Page">
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Header & Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <header className="h-16 bg-[#0b101b] border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between shrink-0">
            {/* Left side: mobile toggle & current location */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h1>
                <span className="hidden sm:inline-block text-slate-500">•</span>
                <span className="hidden sm:inline-block text-xs text-slate-400">
                  Every Deal. Every Update. Always in Sync.
                </span>
              </div>
            </div>

            {/* Right side: quick action buttons & status */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>

              <Link
                href="/dashboard/demo"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Hackathon Demo</span>
              </Link>
            </div>
          </header>

          {/* Mobile Drawer Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex">
              <div className="w-64 bg-[#0c121e] border-r border-slate-800 p-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <span className="font-bold text-white text-base">DealSync Sentinel</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <nav className="mt-4 space-y-1">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                            isActive ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                  <p className="font-medium text-white">DealSync Sentinel v1.0</p>
                  <p>Fastn Integration Hackathon</p>
                </div>
              </div>
              <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
            </div>
          )}

          {/* Main Scrollable View */}
          <main className="flex-1 overflow-y-auto bg-[#090d16]">
            {children}
          </main>
        </div>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};
