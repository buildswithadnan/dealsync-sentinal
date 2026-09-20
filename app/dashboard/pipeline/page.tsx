'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useDealSync } from '@/context/DealSyncContext';
import { Deal, DealStage, SyncStatus } from '@/types/dealsync';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  LayoutList, 
  Kanban, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  AlertOctagon, 
  ExternalLink, 
  X, 
  Edit3, 
  RefreshCw, 
  Radio, 
  ChevronRight,
  Building,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function PipelinePage() {
  const { deals, updateDeal, triggerManualSync, addToast } = useDealSync();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedSyncStatus, setSelectedSyncStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'amount' | 'name' | 'stage'>('amount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  // Edit states in drawer
  const [editingSide, setEditingSide] = useState<'hubspot' | 'notion' | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editStage, setEditStage] = useState<DealStage>('Proposal');

  const STAGES: DealStage[] = [
    'New Lead',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];

  // Filter & Sort
  const filteredDeals = useMemo(() => {
    return deals
      .filter((deal) => {
        const matchesSearch = 
          deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.owner.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStage = selectedStage === 'All' || deal.stage === selectedStage;
        const matchesSync = selectedSyncStatus === 'All' || deal.syncStatus === selectedSyncStatus;
        return matchesSearch && matchesStage && matchesSync;
      })
      .sort((a, b) => {
        if (sortBy === 'amount') {
          return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        } else if (sortBy === 'name') {
          return sortOrder === 'desc' 
            ? b.name.localeCompare(a.name) 
            : a.name.localeCompare(b.name);
        } else {
          return sortOrder === 'desc'
            ? b.stage.localeCompare(a.stage)
            : a.stage.localeCompare(b.stage);
        }
      });
  }, [deals, searchQuery, selectedStage, selectedSyncStatus, sortBy, sortOrder]);

  const openDealDrawer = (deal: Deal) => {
    setActiveDeal(deal);
    setEditAmount(deal.amount);
    setEditStage(deal.stage);
    setEditingSide(null);
  };

  const handleSaveEdit = (side: 'hubspot' | 'notion') => {
    if (!activeDeal) return;
    updateDeal(activeDeal.id, { amount: editAmount, stage: editStage }, side);
    setEditingSide(null);
    // Refresh activeDeal in drawer
    const updated = deals.find(d => d.id === activeDeal.id);
    if (updated) {
      setActiveDeal({
        ...updated,
        amount: side === 'hubspot' ? editAmount : updated.amount,
        stage: side === 'hubspot' ? editStage : updated.stage,
        hubspotAmount: side === 'hubspot' ? editAmount : updated.hubspotAmount,
        notionAmount: side === 'notion' ? editAmount : updated.notionAmount,
        hubspotStage: side === 'hubspot' ? editStage : updated.hubspotStage,
        notionStage: side === 'notion' ? editStage : updated.notionStage
      });
    }
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">CRM Pipeline Intelligence</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                {filteredDeals.length} deals mapped
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Synchronized view across HubSpot deals and Notion database pages with live parity validation.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals by name, company, or owner..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white"
                title="Toggle sort order"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2 px-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="amount">Sort by Value</option>
                <option value="name">Sort by Name</option>
                <option value="stage">Sort by Stage</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
            {/* Stage filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Stage:</span>
              {['All', ...STAGES].map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    selectedStage === stage
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-950/40 text-slate-400 border border-slate-800/80 hover:text-white'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>

            {/* Sync status filter pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Sync:</span>
              {['All', 'In Sync', 'Conflict', 'Pending', 'Failed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedSyncStatus(status)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    selectedSyncStatus === status
                      ? 'bg-slate-800 text-white border border-slate-600'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Mode 1: Table View */}
        {viewMode === 'table' && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0c121e] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Deal Name</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Value</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Expected Close</th>
                    <th className="py-3 px-4">HubSpot</th>
                    <th className="py-3 px-4">Notion</th>
                    <th className="py-3 px-4 text-center">Sync State</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
                  {filteredDeals.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-500">
                        No deals matched the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredDeals.map((deal) => (
                      <tr
                        key={deal.id}
                        onClick={() => openDealDrawer(deal)}
                        className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                      >
                        <td className="py-3 px-4 font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {deal.name}
                        </td>
                        <td className="py-3 px-4 text-slate-400">{deal.company}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-200 border border-slate-700 text-[11px]">
                            {deal.stage}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          ${deal.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-slate-300">{deal.owner}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{deal.expectedClose}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                            {deal.hubspotId}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                            {deal.notionPageId}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {deal.syncStatus === 'In Sync' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              In Sync
                            </span>
                          ) : deal.syncStatus === 'Conflict' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Conflict
                            </span>
                          ) : deal.syncStatus === 'Failed' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400">
                              <AlertOctagon className="w-3.5 h-3.5" />
                              Failed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400">
                              <Clock className="w-3.5 h-3.5" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDealDrawer(deal);
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                          >
                            Inspect →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Mode 2: Kanban Board View */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
            {STAGES.map((stage) => {
              const stageDeals = filteredDeals.filter((d) => d.stage === stage);
              const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);

              return (
                <div key={stage} className="min-w-[200px] flex flex-col rounded-xl bg-slate-900/50 border border-slate-800 p-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                    <span className="text-xs font-bold text-white tracking-tight">{stage}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 mb-2">
                    ${stageTotal.toLocaleString()}
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        onClick={() => openDealDrawer(deal)}
                        className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h4 className="text-xs font-semibold text-white leading-snug">{deal.name}</h4>
                          {deal.syncStatus === 'Conflict' && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Conflict active" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2">{deal.company}</p>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-semibold text-emerald-400">
                            ${deal.amount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500">{deal.owner.split(' ')[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Deal Drawer */}
        {activeDeal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-xl bg-[#0c121e] border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto h-full shadow-2xl">
              <div>
                {/* Drawer Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                      CRM Record Inspector
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">{activeDeal.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>{activeDeal.company}</span>
                      <span>•</span>
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{activeDeal.owner}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveDeal(null)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Identity & Identifiers Strip */}
                <div className="mt-5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      HubSpot Deal ID:
                    </span>
                    <span className="font-mono text-white font-semibold">{activeDeal.hubspotId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                      Notion Page ID:
                    </span>
                    <span className="font-mono text-white font-semibold">{activeDeal.notionPageId}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Sync Status:</span>
                    <span className="font-semibold text-emerald-400">{activeDeal.syncStatus}</span>
                  </div>
                </div>

                {/* Side-by-Side Comparison: HubSpot vs Notion */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Side-by-Side System Parity
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {/* HubSpot Side */}
                    <div className="p-4 rounded-xl bg-orange-950/10 border border-orange-500/20 text-xs space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-orange-500/20 text-orange-400 font-bold">
                        <span>HubSpot CRM</span>
                        <span className="text-[10px] font-mono">{activeDeal.hubspotStatus}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Deal Value</span>
                        <span className="text-sm font-bold text-white font-mono">
                          ${(activeDeal.hubspotAmount || activeDeal.amount).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Pipeline Stage</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {activeDeal.hubspotStage || activeDeal.stage}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingSide('hubspot');
                          setEditAmount(activeDeal.hubspotAmount || activeDeal.amount);
                          setEditStage(activeDeal.hubspotStage || activeDeal.stage);
                        }}
                        className="w-full mt-2 py-1 px-2 rounded bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-[11px] font-semibold border border-orange-500/30 flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Simulate HubSpot Edit</span>
                      </button>
                    </div>

                    {/* Notion Side */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700 text-slate-300 font-bold">
                        <span>Notion Page</span>
                        <span className="text-[10px] font-mono">{activeDeal.notionStatus}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Deal Value</span>
                        <span className="text-sm font-bold text-white font-mono">
                          ${(activeDeal.notionAmount || activeDeal.amount).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Pipeline Stage</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {activeDeal.notionStage || activeDeal.stage}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingSide('notion');
                          setEditAmount(activeDeal.notionAmount || activeDeal.amount);
                          setEditStage(activeDeal.notionStage || activeDeal.stage);
                        }}
                        className="w-full mt-2 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-600 flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Simulate Notion Edit</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated Edit Controls Form */}
                {editingSide && (
                  <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-indigo-500/40 animate-in fade-in">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-bold text-indigo-300 uppercase">
                        Simulating {editingSide.toUpperCase()} Update
                      </span>
                      <button onClick={() => setEditingSide(null)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">New Value ($ USD)</label>
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(Number(e.target.value))}
                          className="w-full py-1.5 px-2.5 rounded bg-slate-900 border border-slate-800 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">New Stage</label>
                        <select
                          value={editStage}
                          onChange={(e) => setEditStage(e.target.value as DealStage)}
                          className="w-full py-1.5 px-2.5 rounded bg-slate-900 border border-slate-800 text-white"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => setEditingSide(null)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(editingSide)}
                        className="px-3 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow"
                      >
                        Apply Simulated Edit
                      </button>
                    </div>
                  </div>
                )}

                {/* Conflict Banner if in Conflict */}
                {activeDeal.syncStatus === 'Conflict' && (
                  <div className="mt-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>This deal has contradictory updates flagged in Conflict Radar.</span>
                    </div>
                    <Link
                      href="/dashboard/conflicts"
                      className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 shadow"
                    >
                      Resolve
                    </Link>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-slate-800 mt-6 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Last synced: {activeDeal.lastSyncedAt}
                </span>
                <button
                  onClick={() => {
                    triggerManualSync();
                    setActiveDeal(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Synchronize Record</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
