import { NextRequest, NextResponse } from 'next/server';

const FASTN_API_URL = process.env.FASTN_API_URL || 'https://api.fastn.com';
const FASTN_API_KEY = process.env.FASTN_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conflictId, strategy, mergedValues, notes } = body;

    if (!conflictId || !strategy) {
      return NextResponse.json(
        { error: 'Missing required fields: conflictId and strategy' },
        { status: 400 }
      );
    }

    // Call DS-04 workflow to resolve the conflict
    const response = await fetch(
      `${FASTN_API_URL}/v1/workflows/ds-04-conflict-resolution/execute`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FASTN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conflict_id: conflictId,
          resolution_strategy: strategy,
          merged_values: mergedValues,
          resolution_notes: notes
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to resolve conflict');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Conflict resolved successfully',
      result
    });
  } catch (error) {
    console.error('Error resolving conflict:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to resolve conflict' },
      { status: 500 }
    );
  }
}
