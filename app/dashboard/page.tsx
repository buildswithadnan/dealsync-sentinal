'use client';

import { useEffect, useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  TrendingUp,
  Database,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface SyncStats {
  synced: number;
  conflicts: number;
  errors: number;
  lastSync: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<SyncStats>({
    synced: 0,
    conflicts: 0,
    errors: 0,
    lastSync: 'Never'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      // TODO: Replace with your Fastn API endpoint
      const response = await fetch('/api/sync-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Deals Synced',
      value: stats.synced,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+12% from last week'
    },
    {
      title: 'Active Conflicts',
      value: stats.conflicts,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: stats.conflicts > 0 ? 'Needs attention' : 'All resolved',
      link: '/dashboard/conflicts'
    },
    {
      title: 'Sync Errors',
      value: stats.errors,
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: stats.errors === 0 ? 'Healthy' : 'Check logs'
    },
    {
      title: 'Last Sync',
      value: stats.lastSync,
      icon: RefreshCw,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'Auto-syncing'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DealSync Sentinel</h1>
              <p className="mt-1 text-sm text-gray-500">
                HubSpot ↔ Notion Bidirectional Sync
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchStats}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <Link
                href="/dashboard/conflicts"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Conflicts
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;

            const cardContent = (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  {loading && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </p>
                <p className="text-xs text-gray-500">{card.trend}</p>
              </>
            );

            if (card.link) {
              return (
                <Link
                  key={index}
                  href={card.link}
                  className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6"
              >
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* Workflow Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-600" />
              Active Workflows
            </h2>
            <div className="space-y-4">
              <WorkflowStatus
                name="DS-01: HubSpot → Notion"
                status="active"
                lastRun="2 minutes ago"
                success={247}
                failed={0}
              />
              <WorkflowStatus
                name="DS-02: Notion → HubSpot"
                status="active"
                lastRun="5 minutes ago"
                success={128}
                failed={2}
              />
              <WorkflowStatus
                name="DS-04: Conflict Resolution"
                status="manual"
                lastRun="1 hour ago"
                success={12}
                failed={0}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-600" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              <ActivityItem
                type="sync"
                message="Synced deal: Web Application Build"
                time="2 mins ago"
                status="success"
              />
              <ActivityItem
                type="conflict"
                message="Conflict detected: Fastn Test Deal"
                time="15 mins ago"
                status="warning"
              />
              <ActivityItem
                type="sync"
                message="Updated deal stage: appointmentscheduled"
                time="22 mins ago"
                status="success"
              />
              <ActivityItem
                type="error"
                message="Failed to sync deal 349208396518"
                time="1 hour ago"
                status="error"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/conflicts"
              className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-4 transition-colors"
            >
              <AlertTriangle className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Resolve Conflicts</h3>
              <p className="text-sm opacity-90">Manage sync conflicts</p>
            </Link>
            <Link
              href="/dashboard/sync-status"
              className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-4 transition-colors"
            >
              <TrendingUp className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">View Sync History</h3>
              <p className="text-sm opacity-90">Check past syncs</p>
            </Link>
            <Link
              href="/dashboard/settings"
              className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-4 transition-colors"
            >
              <RefreshCw className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Configure Workflows</h3>
              <p className="text-sm opacity-90">Manage settings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowStatus({
  name,
  status,
  lastRun,
  success,
  failed
}: {
  name: string;
  status: 'active' | 'paused' | 'manual';
  lastRun: string;
  success: number;
  failed: number;
}) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-gray-100 text-gray-800',
    manual: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <p className="text-xs text-gray-500">Last run: {lastRun}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs text-green-600">{success} success</p>
          {failed > 0 && <p className="text-xs text-red-600">{failed} failed</p>}
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function ActivityItem({
  type,
  message,
  time,
  status
}: {
  type: 'sync' | 'conflict' | 'error';
  message: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}) {
  const icons = {
    sync: RefreshCw,
    conflict: AlertTriangle,
    error: Activity
  };

  const colors = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  const Icon = icons[type];

  return (
    <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
      <Icon className={`w-4 h-4 mt-0.5 ${colors[status]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">{message}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}
