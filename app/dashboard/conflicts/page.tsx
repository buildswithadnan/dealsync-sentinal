'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';

interface Conflict {
  id: string;
  dealId: string;
  dealName: string;
  status: string;
  detectedAt: string;
  conflictedFields: string[];
  hubspotValue: Record<string, any>;
  notionValue: Record<string, any>;
}

export default function ConflictsPage() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    try {
      const response = await fetch('/api/conflicts');
      if (response.ok) {
        const data = await response.json();
        setConflicts(data.conflicts || []);
      }
    } catch (error) {
      console.error('Failed to fetch conflicts:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveConflict = async (strategy: string, mergedValues?: Record<string, any>) => {
    if (!selectedConflict) return;

    setResolving(true);
    try {
      const response = await fetch('/api/conflicts/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conflictId: selectedConflict.id,
          strategy,
          mergedValues,
          notes: `Resolved via UI using ${strategy} strategy`
        }),
      });

      if (response.ok) {
        // Remove resolved conflict from list
        setConflicts(conflicts.filter(c => c.id !== selectedConflict.id));
        setSelectedConflict(null);
        alert('Conflict resolved successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to resolve conflict: ${error.error}`);
      }
    } catch (error) {
      console.error('Error resolving conflict:', error);
      alert('Failed to resolve conflict');
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Conflict Resolution</h1>
              <p className="mt-1 text-sm text-gray-500">
                Resolve sync conflicts between HubSpot and Notion
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{conflicts.length}</p>
              <p className="text-sm text-gray-500">Active Conflicts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : conflicts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">All Clear!</h2>
            <p className="text-gray-500">No conflicts detected. Your sync is running smoothly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conflicts List */}
            <div className="space-y-4">
              {conflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  onClick={() => setSelectedConflict(conflict)}
                  className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
                    selectedConflict?.id === conflict.id
                      ? 'ring-2 ring-blue-500'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{conflict.dealName}</h3>
                        <p className="text-sm text-gray-500">Deal ID: {conflict.dealId}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      {conflict.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Conflicted Fields:</span>{' '}
                      {conflict.conflictedFields.join(', ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Detected: {new Date(conflict.detectedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resolution Panel */}
            {selectedConflict ? (
              <div className="bg-white rounded-lg shadow p-6 lg:sticky lg:top-8 h-fit">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Resolve Conflict</h2>
                  <button
                    onClick={() => setSelectedConflict(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedConflict.dealName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Choose which version to keep or merge the values manually.
                  </p>
                </div>

                {/* Value Comparison */}
                <div className="space-y-4 mb-6">
                  {selectedConflict.conflictedFields.map((field) => (
                    <div key={field} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{field}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">HubSpot</p>
                          <p className="text-sm text-gray-900">
                            {JSON.stringify(
                              selectedConflict.hubspotValue[
                                field.toLowerCase().replace(/ /g, '')
                              ] || 'N/A'
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Notion</p>
                          <p className="text-sm text-gray-900">
                            {JSON.stringify(
                              selectedConflict.notionValue[
                                field.toLowerCase().replace(/ /g, '')
                              ] || 'N/A'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resolution Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => resolveConflict('hubspot_wins')}
                    disabled={resolving}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                  >
                    {resolving ? 'Resolving...' : 'Keep HubSpot Version'}
                  </button>
                  <button
                    onClick={() => resolveConflict('notion_wins')}
                    disabled={resolving}
                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                  >
                    {resolving ? 'Resolving...' : 'Keep Notion Version'}
                  </button>
                  <button
                    onClick={() => resolveConflict('dismiss')}
                    disabled={resolving}
                    className="w-full px-4 py-3 border-2 border-gray-300 hover:border-gray-400 disabled:border-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    {resolving ? 'Resolving...' : 'Dismiss Conflict'}
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  Manual merge coming soon
                </p>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a conflict to resolve</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
