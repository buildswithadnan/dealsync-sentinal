'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Deal, 
  Conflict, 
  SyncEvent, 
  FieldMapping, 
  ToastMessage, 
  DealStage, 
  DemoScenario 
} from '@/types/dealsync';
import { 
  INITIAL_DEALS, 
  INITIAL_CONFLICTS, 
  INITIAL_SYNC_EVENTS, 
  INITIAL_FIELD_MAPPINGS 
} from '@/lib/mockData';

export const SCENARIOS_DEF: DemoScenario[] = [
  {
    id: 'sc-1',
    scenarioNumber: 1,
    title: 'New Deal Created',
    subtitle: 'Zero-Touch Notion Record Generation',
    description: 'Create a new HubSpot deal event and observe Fastn provision an identical Notion page without duplicates.',
    expectedResult: 'Single matching Notion record created • 0 duplicate pages • Audit log updated',
    badge: 'Creation & Idempotency',
    steps: [
      { title: 'Inbound HubSpot Deal Webhook', description: 'Capture deal.create webhook payload with stable ID hs-deal-94301', status: 'idle' },
      { title: 'Fastn Deduplication & Identity Matching', description: 'Query Notion database using HubSpot CRM UUID index', status: 'idle' },
      { title: 'Notion Page Creation', description: 'Create matching page in "Enterprise Deals Pipeline" database', status: 'idle' },
      { title: 'Telemetry & Audit Log Write', description: 'Record bidirectional state commit to immutable audit trail', status: 'idle' }
    ]
  },
  {
    id: 'sc-2',
    scenarioNumber: 2,
    title: 'CRM Deal Updated',
    subtitle: 'Selective In-Place Property Sync',
    description: 'Rep changes deal stage and value in HubSpot. Fastn identifies existing record and updates Notion in-place.',
    expectedResult: 'Existing Notion record updated • No duplicate created • Audit log records update',
    badge: 'Property Synchronization',
    steps: [
      { title: 'Property Change Trigger', description: 'HubSpot sales rep increases deal value & advances pipeline stage', status: 'idle' },
      { title: 'State Diff Verification', description: 'Fastn hashes previous vs incoming payload to detect actual changes', status: 'idle' },
      { title: 'In-Place Property Patch', description: 'Issue atomic Notion update API call without recreation', status: 'idle' }
    ]
  },
  {
    id: 'sc-3',
    scenarioNumber: 3,
    title: 'Duplicate Event Protection',
    subtitle: 'Strict Webhook Idempotency Check',
    description: 'Replay an identical webhook payload. DealSync recognizes the idempotency key and prevents duplicate page writes.',
    expectedResult: 'Existing record recognized • 0 duplicates • 0 redundant writes dispatched',
    badge: 'Idempotency Filter',
    steps: [
      { title: 'Replay Inbound Webhook', description: 'Resend identical payload with existing signature', status: 'idle' },
      { title: 'Idempotency Cache Lookup', description: 'Compare SHA-256 payload hash against recent 24h event cache', status: 'idle' },
      { title: 'Zero-Write Guard', description: 'Acknowledge webhook with HTTP 200 OK and suppress duplicate write', status: 'idle' }
    ]
  },
  {
    id: 'sc-4',
    scenarioNumber: 4,
    title: 'Conflict Detection',
    subtitle: 'Concurrent Edit Interception',
    description: 'Simulate conflicting changes made simultaneously in both HubSpot and Notion before synchronization.',
    expectedResult: 'Conflict Radar flags discrepancy • Both values preserved • Deal status set to Conflict',
    badge: 'Conflict Radar',
    steps: [
      { title: 'Detect Concurrent Edits', description: 'HubSpot rep sets $95,000 while Notion team member writes $110,000', status: 'idle' },
      { title: 'Three-Way Merge Analysis', description: 'Fastn compares both values against last synchronized baseline', status: 'idle' },
      { title: 'Quarantine & Alert', description: 'Freeze automated overwrite and route to Conflict Radar queue', status: 'idle' }
    ]
  },
  {
    id: 'sc-5',
    scenarioNumber: 5,
    title: 'Conflict Resolution',
    subtitle: 'Human-in-the-Loop Safe Merge',
    description: 'Resolve a conflicting deal with a single click: enforce HubSpot or Notion truth, or merge changes safely.',
    expectedResult: 'Chosen value applied • Conflict marked resolved • Audit log records operator decision',
    badge: 'Resolution Workflow',
    steps: [
      { title: 'Operator Decision', description: 'Select winning source of truth in Conflict Radar modal', status: 'idle' },
      { title: 'Targeted Synchronization', description: 'Propagate chosen state to out-of-sync destination', status: 'idle' },
      { title: 'Clear Quarantine', description: 'Restore deal to healthy "In Sync" status with operator audit trail', status: 'idle' }
    ]
  },
  {
    id: 'sc-6',
    scenarioNumber: 6,
    title: 'Failed Sync & Recovery',
    subtitle: 'Zero-Data-Loss Resilient Retry',
    description: 'Simulate a destination rate-limit (HTTP 429), verify error telemetry, and trigger an automated retry.',
    expectedResult: 'Sync status set to Failed • Appears in audit log • One-click retry recovers healthy state',
    badge: 'Fault Tolerance',
    steps: [
      { title: 'Simulate Destination Error', description: 'Mock 429 Notion Rate Limit during synchronous commit', status: 'idle' },
      { title: 'Dead-Letter Queue Entry', description: 'Capture failed payload into persistent retry queue', status: 'idle' },
      { title: 'Replay Execution', description: 'Execute safe retry using original idempotency key to recover', status: 'idle' }
    ]
  }
];

interface DealSyncMetrics {
  totalDeals: number;
  syncedDeals: number;
  pendingSync: number;
  openConflicts: number;
  failedSyncs: number;
  lastSyncTimestamp: string;
}

interface DealSyncContextType {
  deals: Deal[];
  conflicts: Conflict[];
  auditLogs: SyncEvent[];
  fieldMappings: FieldMapping[];
  metrics: DealSyncMetrics;
  toasts: ToastMessage[];
  scenarios: DemoScenario[];
  activeScenarioId: string | null;
  isScenarioRunning: boolean;
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  resolveConflict: (
    conflictId: string, 
    resolutionType: 'hubspot' | 'notion' | 'merge' | 'defer', 
    customValue?: string | number
  ) => void;
  updateDeal: (dealId: string, updates: Partial<Deal>, source: 'hubspot' | 'notion') => void;
  createDeal: (deal: {
    name: string;
    company: string;
    amount: number;
    stage: DealStage;
    owner: string;
  }) => Deal;
  replayFailedEvent: (eventId: string) => void;
  triggerManualSync: () => void;
  runScenario: (scenarioNumber: number) => Promise<void>;
  resetDemoData: () => void;
}

const DealSyncContext = createContext<DealSyncContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'dealsync_sentinel_state_v1';

export const DealSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [conflicts, setConflicts] = useState<Conflict[]>(INITIAL_CONFLICTS);
  const [auditLogs, setAuditLogs] = useState<SyncEvent[]>(INITIAL_SYNC_EVENTS);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(INITIAL_FIELD_MAPPINGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [scenarios, setScenarios] = useState<DemoScenario[]>(SCENARIOS_DEF);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [isScenarioRunning, setIsScenarioRunning] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.deals) setDeals(parsed.deals);
        if (parsed.conflicts) setConflicts(parsed.conflicts);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      }
    } catch (e) {
      console.error('Failed to parse saved DealSync state', e);
    }
  }, []);

  // Save to localStorage whenever core state updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        deals,
        conflicts,
        auditLogs
      }));
    } catch (e) {
      console.error('Failed to persist DealSync state', e);
    }
  }, [deals, conflicts, auditLogs]);

  // Derived metrics
  const metrics: DealSyncMetrics = {
    totalDeals: deals.length,
    syncedDeals: deals.filter(d => d.syncStatus === 'In Sync').length,
    pendingSync: deals.filter(d => d.syncStatus === 'Pending').length,
    openConflicts: conflicts.filter(c => c.status === 'unresolved').length,
    failedSyncs: deals.filter(d => d.syncStatus === 'Failed').length,
    lastSyncTimestamp: lastSyncTime
  };

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const resolveConflict = (
    conflictId: string, 
    resolutionType: 'hubspot' | 'notion' | 'merge' | 'defer', 
    customValue?: string | number
  ) => {
    const conflict = conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    if (resolutionType === 'defer') {
      setConflicts(prev => prev.map(c => 
        c.id === conflictId 
          ? { ...c, status: 'deferred' } 
          : c
      ));
      addToast('info', 'Conflict Deferred', `Conflict for "${conflict.dealName}" deferred for manual review.`);
      return;
    }

    let winningValue: string | number;
    let detailsMessage = '';

    if (resolutionType === 'hubspot') {
      winningValue = conflict.hubspotValue;
      detailsMessage = `Operator kept HubSpot value (${winningValue}). Propagated to Notion page.`;
    } else if (resolutionType === 'notion') {
      winningValue = conflict.notionValue;
      detailsMessage = `Operator kept Notion value (${winningValue}). Propagated to HubSpot CRM deal.`;
    } else if (resolutionType === 'merge') {
      winningValue = customValue ?? conflict.hubspotValue;
      detailsMessage = `Smart merge applied: Non-conflicting attributes merged; ${conflict.fieldLabel} set to ${winningValue}.`;
    } else {
      winningValue = customValue ?? conflict.hubspotValue;
      detailsMessage = `Manual resolution applied: value set to ${winningValue}.`;
    }

    // Update conflict item
    setConflicts(prev => prev.map(c => 
      c.id === conflictId ? {
        ...c,
        status: 'resolved',
        resolvedAt: 'Just now',
        resolvedBy: 'Alex Chen (Revenue Ops)',
        chosenSide: resolutionType,
        resolvedValue: winningValue
      } : c
    ));

    // Update target deal
    setDeals(prev => prev.map(d => {
      if (d.id === conflict.dealId) {
        let updatedAmount = d.amount;
        let updatedStage = d.stage;

        if (conflict.field === 'amount') {
          const numericVal = typeof winningValue === 'string' 
            ? parseFloat(winningValue.replace(/[^0-9.]/g, '')) 
            : winningValue;
          updatedAmount = isNaN(numericVal) ? d.amount : numericVal;
        } else if (conflict.field === 'stage') {
          updatedStage = winningValue as DealStage;
        }

        return {
          ...d,
          amount: updatedAmount,
          stage: updatedStage,
          hubspotAmount: updatedAmount,
          notionAmount: updatedAmount,
          hubspotStage: updatedStage,
          notionStage: updatedStage,
          hubspotStatus: 'synced',
          notionStatus: 'synced',
          syncStatus: 'In Sync',
          lastSyncedAt: 'Just now'
        };
      }
      return d;
    }));

    // Record audit event
    const newEvent: SyncEvent = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      dealId: conflict.dealId,
      dealName: conflict.dealName,
      operation: 'conflict_resolved',
      direction: resolutionType === 'hubspot' ? 'hubspot_to_notion' : 'notion_to_hubspot',
      result: 'success',
      version: 'v4.1.4-res',
      timestamp: 'Just now',
      details: detailsMessage,
      idempotencyKey: `idemp-res-${conflict.id}-${Date.now()}`,
      changedFields: {
        [conflict.field]: {
          from: `Conflict (${conflict.hubspotValue} vs ${conflict.notionValue})`,
          to: winningValue
        }
      }
    };

    setAuditLogs(prev => [newEvent, ...prev]);
    addToast('success', 'Conflict Resolved', `Successfully synchronized "${conflict.dealName}". Notion & HubSpot now in sync.`);
  };

  const updateDeal = (dealId: string, updates: Partial<Deal>, source: 'hubspot' | 'notion') => {
    const existing = deals.find(d => d.id === dealId);
    if (!existing) return;

    const isSimulatedEdit = true;

    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        const updated = { ...d, ...updates };
        if (source === 'hubspot') {
          if (updates.amount !== undefined) updated.hubspotAmount = updates.amount;
          if (updates.stage !== undefined) updated.hubspotStage = updates.stage;
          updated.hubspotStatus = 'modified';
        } else {
          if (updates.amount !== undefined) updated.notionAmount = updates.amount;
          if (updates.stage !== undefined) updated.notionStage = updates.stage;
          updated.notionStatus = 'modified';
        }

        // Check for conflict
        if (updated.hubspotAmount !== updated.notionAmount || updated.hubspotStage !== updated.notionStage) {
          updated.syncStatus = 'Conflict';
        } else {
          updated.syncStatus = 'Pending';
        }
        return updated;
      }
      return d;
    }));

    const newEvent: SyncEvent = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      dealId: existing.id,
      dealName: existing.name,
      operation: 'update',
      direction: source === 'hubspot' ? 'hubspot_to_notion' : 'notion_to_hubspot',
      result: 'success',
      version: 'v4.1.3',
      timestamp: 'Just now',
      details: `Simulated property update on ${source.toUpperCase()} side: ${Object.keys(updates).join(', ')}.`,
      idempotencyKey: `idemp-${dealId}-update-${Date.now()}`
    };

    setAuditLogs(prev => [newEvent, ...prev]);
    addToast('info', 'Deal Updated', `Simulated edit committed on ${source.toUpperCase()}.`);
  };

  const createDeal = (dealData: {
    name: string;
    company: string;
    amount: number;
    stage: DealStage;
    owner: string;
  }): Deal => {
    const numId = Math.floor(10000 + Math.random() * 90000);
    const newDeal: Deal = {
      id: `deal-${Date.now().toString().slice(-3)}`,
      name: dealData.name,
      company: dealData.company,
      stage: dealData.stage,
      amount: dealData.amount,
      owner: dealData.owner,
      expectedClose: '2026-11-30',
      hubspotId: `hs-deal-${numId}`,
      notionPageId: `notion-page-${numId.toString(16)}a`,
      hubspotStatus: 'synced',
      notionStatus: 'synced',
      syncStatus: 'In Sync',
      lastSyncedAt: 'Just now',
      hubspotAmount: dealData.amount,
      notionAmount: dealData.amount,
      hubspotStage: dealData.stage,
      notionStage: dealData.stage
    };

    setDeals(prev => [newDeal, ...prev]);

    const newEvent: SyncEvent = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      dealId: newDeal.id,
      dealName: newDeal.name,
      operation: 'create',
      direction: 'hubspot_to_notion',
      result: 'success',
      version: 'v4.2.0-create',
      timestamp: 'Just now',
      details: `New CRM deal matched and provisioned into Notion database with ID ${newDeal.notionPageId}. 0 duplicates created.`,
      idempotencyKey: `idemp-${newDeal.hubspotId}-init`
    };

    setAuditLogs(prev => [newEvent, ...prev]);
    addToast('success', 'Deal Created & Synced', `"${newDeal.name}" synchronized between HubSpot and Notion.`);
    return newDeal;
  };

  const replayFailedEvent = (eventId: string) => {
    const event = auditLogs.find(e => e.id === eventId);
    if (!event) return;

    // Mark corresponding deal as In Sync
    setDeals(prev => prev.map(d => {
      if (d.id === event.dealId) {
        return {
          ...d,
          syncStatus: 'In Sync',
          hubspotStatus: 'synced',
          notionStatus: 'synced',
          lastSyncedAt: 'Just now'
        };
      }
      return d;
    }));

    // Add replayed event
    const retryEvent: SyncEvent = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      dealId: event.dealId,
      dealName: event.dealName,
      operation: 'retried',
      direction: event.direction,
      result: 'success',
      version: 'v4.1.5-retry',
      timestamp: 'Just now',
      details: `Replay successful using original idempotency key ${event.idempotencyKey}. Notion API 200 OK.`,
      idempotencyKey: `idemp-replay-${Date.now()}`
    };

    setAuditLogs(prev => [retryEvent, ...prev]);
    addToast('success', 'Event Replayed Successfully', `Recovered sync for "${event.dealName}".`);
  };

  const triggerManualSync = () => {
    setLastSyncTime('Just now');
    setDeals(prev => prev.map(d => {
      if (d.syncStatus === 'Pending') {
        return {
          ...d,
          syncStatus: 'In Sync',
          hubspotStatus: 'synced',
          notionStatus: 'synced',
          lastSyncedAt: 'Just now'
        };
      }
      return d;
    }));

    const syncEvent: SyncEvent = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      dealId: 'all',
      dealName: 'Pipeline Health Check',
      operation: 'update',
      direction: 'bidirectional',
      result: 'success',
      version: 'v4.2.0',
      timestamp: 'Just now',
      details: 'Full two-way synchronization run executed. Verified 24 deal mappings across HubSpot CRM and Notion workspace.',
      idempotencyKey: `idemp-fullsync-${Date.now()}`
    };

    setAuditLogs(prev => [syncEvent, ...prev]);
    addToast('success', 'Sync Completed', 'All mapped properties verified across HubSpot and Notion.');
  };

  const runScenario = async (scenarioNumber: number) => {
    const sc = scenarios.find(s => s.scenarioNumber === scenarioNumber);
    if (!sc) return;

    setActiveScenarioId(sc.id);
    setIsScenarioRunning(true);

    try {
      if (scenarioNumber === 1) {
        // Scenario 1: New Deal Created
        const newDeal = createDeal({
          name: 'Quantum Computing Pilot',
          company: 'Nexus Cybernetics',
          amount: 280000,
          stage: 'Qualified',
          owner: 'Sarah Connor'
        });
        addToast('success', 'Scenario 1 Complete', `Created "${newDeal.name}" in HubSpot with exact Notion match.`);
      } 
      else if (scenarioNumber === 2) {
        // Scenario 2: CRM Deal Updated
        const targetDeal = deals.find(d => d.id === 'deal-002') || deals[1];
        if (targetDeal) {
          setDeals(prev => prev.map(d => 
            d.id === targetDeal.id 
              ? {
                  ...d,
                  amount: 95000,
                  hubspotAmount: 95000,
                  notionAmount: 95000,
                  stage: 'Negotiation',
                  hubspotStage: 'Negotiation',
                  notionStage: 'Negotiation',
                  syncStatus: 'In Sync',
                  lastSyncedAt: 'Just now'
                } 
              : d
          ));
          const evt: SyncEvent = {
            id: `evt-${Date.now().toString().slice(-4)}`,
            dealId: targetDeal.id,
            dealName: targetDeal.name,
            operation: 'update',
            direction: 'hubspot_to_notion',
            result: 'success',
            version: 'v4.2.1',
            timestamp: 'Just now',
            details: `HubSpot updated deal to $95,000 / Negotiation. Existing Notion record (ID ${targetDeal.notionPageId}) patched in-place. 0 duplicates.`,
            idempotencyKey: `idemp-sc2-${Date.now()}`,
            changedFields: {
              amount: { from: 85000, to: 95000 },
              stage: { from: 'Proposal', to: 'Negotiation' }
            }
          };
          setAuditLogs(prev => [evt, ...prev]);
          addToast('success', 'Scenario 2 Complete', `In-place update confirmed for "${targetDeal.name}". Zero duplicates.`);
        }
      } 
      else if (scenarioNumber === 3) {
        // Scenario 3: Duplicate Event Protection
        const targetDeal = deals.find(d => d.id === 'deal-003') || deals[2];
        const evt: SyncEvent = {
          id: `evt-${Date.now().toString().slice(-4)}`,
          dealId: targetDeal.id,
          dealName: targetDeal.name,
          operation: 'deduplicate',
          direction: 'fastn_engine',
          result: 'skipped',
          version: 'v4.2.1',
          timestamp: 'Just now',
          details: `Replay webhook detected with matching hash for ${targetDeal.hubspotId}. Idempotency lock engaged: redundant write suppressed.`,
          idempotencyKey: `idemp-sc3-${targetDeal.hubspotId}-replay`
        };
        setAuditLogs(prev => [evt, ...prev]);
        addToast('info', 'Scenario 3 Complete', `Duplicate event suppressed for "${targetDeal.name}". Idempotency verified.`);
      } 
      else if (scenarioNumber === 4) {
        // Scenario 4: Conflict Detection
        const targetDeal = deals.find(d => d.id === 'deal-004') || deals[3];
        setDeals(prev => prev.map(d => 
          d.id === targetDeal.id 
            ? {
                ...d,
                hubspotAmount: 95000,
                notionAmount: 110000,
                syncStatus: 'Conflict',
                lastSyncedAt: 'Just now'
              } 
            : d
        ));
        const newConflict: Conflict = {
          id: `conflict-${Date.now().toString().slice(-4)}`,
          dealId: targetDeal.id,
          dealName: targetDeal.name,
          company: targetDeal.company,
          field: 'amount',
          fieldLabel: 'Deal Value',
          hubspotValue: '$95,000',
          notionValue: '$110,000',
          lastSyncedValue: '$75,000',
          detectedAt: 'Just now',
          severity: 'high',
          status: 'unresolved'
        };
        setConflicts(prev => [newConflict, ...prev]);
        const evt: SyncEvent = {
          id: `evt-${Date.now().toString().slice(-4)}`,
          dealId: targetDeal.id,
          dealName: targetDeal.name,
          operation: 'conflict_detected',
          direction: 'bidirectional',
          result: 'conflict',
          version: 'v4.2.2',
          timestamp: 'Just now',
          details: `Concurrent edit detected on "${targetDeal.name}": HubSpot set $95k, Notion set $110k. Routed to Conflict Radar.`,
          idempotencyKey: `idemp-sc4-${Date.now()}`
        };
        setAuditLogs(prev => [evt, ...prev]);
        addToast('warning', 'Scenario 4 Complete', `Conflict detected for "${targetDeal.name}". Check Conflict Radar.`);
      } 
      else if (scenarioNumber === 5) {
        // Scenario 5: Conflict Resolution
        const openConflict = conflicts.find(c => c.status === 'unresolved');
        if (openConflict) {
          resolveConflict(openConflict.id, 'hubspot');
        } else {
          addToast('info', 'No Open Conflicts', 'Run Scenario 4 first to generate an active conflict.');
        }
      } 
      else if (scenarioNumber === 6) {
        // Scenario 6: Failed Sync and Recovery
        const targetDeal = deals.find(d => d.id === 'deal-011') || deals[10];
        setDeals(prev => prev.map(d => 
          d.id === targetDeal.id 
            ? { ...d, syncStatus: 'Failed', hubspotStatus: 'error' } 
            : d
        ));
        const failEvt: SyncEvent = {
          id: `evt-${Date.now().toString().slice(-4)}`,
          dealId: targetDeal.id,
          dealName: targetDeal.name,
          operation: 'failed',
          direction: 'hubspot_to_notion',
          result: 'failed',
          version: 'v4.2.3',
          timestamp: 'Just now',
          details: 'Simulated downstream destination failure: Notion API HTTP 503 Service Unavailable. Queued for replay.',
          idempotencyKey: `idemp-sc6-fail-${Date.now()}`,
          errorDetails: 'HTTP 503: Temporary outage on destination workspace API'
        };
        setAuditLogs(prev => [failEvt, ...prev]);
        addToast('error', 'Scenario 6 Triggered', `Destination failure simulated for "${targetDeal.name}". Click Replay in Audit Log.`);
      }

      setScenarios(prev => prev.map(s => 
        s.id === sc.id ? { ...s, isCompleted: true } : s
      ));
    } finally {
      setIsScenarioRunning(false);
    }
  };

  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setDeals(INITIAL_DEALS);
    setConflicts(INITIAL_CONFLICTS);
    setAuditLogs(INITIAL_SYNC_EVENTS);
    setFieldMappings(INITIAL_FIELD_MAPPINGS);
    setScenarios(SCENARIOS_DEF);
    setLastSyncTime('Just now');
    addToast('info', 'Demo State Reset', 'Restored initial clean demo dataset (24 deals, 2 conflicts, 0 duplicates).');
  };

  return (
    <DealSyncContext.Provider value={{
      deals,
      conflicts,
      auditLogs,
      fieldMappings,
      metrics,
      toasts,
      scenarios,
      activeScenarioId,
      isScenarioRunning,
      addToast,
      removeToast,
      resolveConflict,
      updateDeal,
      createDeal,
      replayFailedEvent,
      triggerManualSync,
      runScenario,
      resetDemoData
    }}>
      {children}
    </DealSyncContext.Provider>
  );
};

export const useDealSync = () => {
  const context = useContext(DealSyncContext);
  if (!context) {
    throw new Error('useDealSync must be used within a DealSyncProvider');
  }
  return context;
};
