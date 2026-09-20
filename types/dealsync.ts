export type DealStage = 
  | 'New Lead'
  | 'Qualified'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export type SyncStatus = 'In Sync' | 'Conflict' | 'Pending' | 'Failed';

export type ConnectorSystem = 'hubspot' | 'notion' | 'fastn';

export interface Deal {
  id: string;
  name: string;
  company: string;
  stage: DealStage;
  amount: number;
  owner: string;
  expectedClose: string;
  hubspotId: string;
  notionPageId: string;
  hubspotStatus: 'synced' | 'modified' | 'pending' | 'error';
  notionStatus: 'synced' | 'modified' | 'pending' | 'error';
  syncStatus: SyncStatus;
  lastSyncedAt: string;
  // Field values by side for diff/conflict inspection
  hubspotAmount: number;
  notionAmount: number;
  hubspotStage: DealStage;
  notionStage: DealStage;
  hubspotCloseDate?: string;
  notionCloseDate?: string;
}

export type ConflictSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ConflictStatus = 'unresolved' | 'resolved' | 'deferred';

export interface Conflict {
  id: string;
  dealId: string;
  dealName: string;
  company: string;
  field: string;
  fieldLabel: string;
  hubspotValue: string | number;
  notionValue: string | number;
  lastSyncedValue: string | number;
  detectedAt: string;
  severity: ConflictSeverity;
  status: ConflictStatus;
  resolvedAt?: string;
  resolvedBy?: string;
  chosenSide?: 'hubspot' | 'notion' | 'merge' | 'merged' | 'manual' | 'defer';
  resolvedValue?: string | number;
}

export type SyncOperation = 
  | 'create' 
  | 'update' 
  | 'deduplicate' 
  | 'conflict_detected' 
  | 'conflict_resolved' 
  | 'failed' 
  | 'retried';

export type SyncDirection = 
  | 'hubspot_to_notion' 
  | 'notion_to_hubspot' 
  | 'bidirectional'
  | 'fastn_engine';

export type SyncResult = 'success' | 'conflict' | 'failed' | 'replayed' | 'skipped';

export interface SyncEvent {
  id: string;
  dealId: string;
  dealName: string;
  operation: SyncOperation;
  direction: SyncDirection;
  result: SyncResult;
  version: string;
  timestamp: string;
  details: string;
  idempotencyKey: string;
  changedFields?: Record<string, { from: any; to: any }>;
  errorDetails?: string;
}

export interface ScenarioStep {
  title: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  resultNotes?: string;
}

export interface DemoScenario {
  id: string;
  scenarioNumber: number;
  title: string;
  subtitle: string;
  description: string;
  expectedResult: string;
  badge: string;
  steps: ScenarioStep[];
  isCompleted?: boolean;
}

export interface IntegrationCardData {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'syncing' | 'degraded' | 'disconnected';
  lastSyncedAt: string;
  objectType: string;
  totalRecords: number;
  supportedEvents: string[];
  latencyMs: number;
}

export interface FieldMapping {
  id: string;
  hubspotField: string;
  hubspotType: string;
  notionProperty: string;
  notionType: string;
  syncDirection: 'two_way' | 'one_way_to_notion' | 'one_way_to_hubspot';
  status: 'active' | 'warning';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
