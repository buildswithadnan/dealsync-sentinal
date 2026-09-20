import { NextRequest, NextResponse } from 'next/server';

// Fastn API configuration
const FASTN_API_URL = process.env.FASTN_API_URL || 'https://api.fastn.com';
const FASTN_API_KEY = process.env.FASTN_API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    // Fetch workflow execution stats from Fastn
    const executionsResponse = await fetch(
      `${FASTN_API_URL}/v1/workflow-executions?limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${FASTN_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!executionsResponse.ok) {
      throw new Error('Failed to fetch executions');
    }

    const executions = await executionsResponse.json();

    // Calculate stats
    const stats = {
      synced: executions.data?.filter((e: any) => 
        e.status === 'completed' && e.workflowId.includes('ds-01')
      ).length || 0,
      conflicts: 0, // Will fetch from Notion conflicts database
      errors: executions.data?.filter((e: any) => 
        e.status === 'failed'
      ).length || 0,
      lastSync: executions.data?.[0]?.createdAt || 'Never',
    };

    // Fetch conflicts from Notion (via Fastn workflow or direct API)
    try {
      const conflictsResponse = await fetch(
        `${FASTN_API_URL}/v1/workflows/ds-02-notion-to-hubspot-v2/execute`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${FASTN_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );

      if (conflictsResponse.ok) {
        const conflictsData = await conflictsResponse.json();
        stats.conflicts = conflictsData.conflicts || 0;
      }
    } catch (error) {
      console.error('Failed to fetch conflicts:', error);
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching sync stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sync stats' },
      { status: 500 }
    );
  }
}
