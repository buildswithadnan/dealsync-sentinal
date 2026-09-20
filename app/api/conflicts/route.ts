import { NextRequest, NextResponse } from 'next/server';

const FASTN_API_URL = process.env.FASTN_API_URL || 'https://api.fastn.com';
const FASTN_API_KEY = process.env.FASTN_API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would query your Notion Conflicts database
    // via the Fastn connector or Notion API directly
    
    // For now, return mock data structure
    const conflicts = [
      {
        id: 'CONFLICT-349208396518-1789852588866',
        dealId: '349208396518',
        dealName: 'Web Application Build',
        status: 'Pending',
        detectedAt: new Date().toISOString(),
        conflictedFields: ['Deal Value', 'Expected Close Date'],
        hubspotValue: {
          dealValue: 15000,
          closeDate: '2025-01-30'
        },
        notionValue: {
          dealValue: 8500,
          closeDate: '2026-11-29'
        }
      }
    ];

    return NextResponse.json({ conflicts });
  } catch (error) {
    console.error('Error fetching conflicts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conflicts' },
      { status: 500 }
    );
  }
}
