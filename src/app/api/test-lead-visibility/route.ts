import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, agentName } = body;

    // Create a test lead
    const testLead = {
      id: `test-${Date.now()}`,
      agentId: agentId || 'AHRPE5559',
      agentName: agentName || 'Test Agent',
      gamerFirstName: 'Test',
      gamerLastName: 'User',
      email: 'test@example.com',
      phone: '555-123-4567',
      status: 'new',
      submittedAt: new Date(),
      hasEmergencyIndicators: false,
      totalSymptoms: 3,
      gamingPlatforms: {
        xbox: { gamertag: 'TestGamer123' }
      }
    };

    // In a real implementation, this would save to the database
    // For now, we'll just return the test lead data
    console.log('Test lead created:', testLead);

    return NextResponse.json({
      success: true,
      message: 'Test lead created successfully',
      lead: testLead,
      note: 'This lead should appear in admin dashboard (all leads) and agent dashboard (filtered by agentId)'
    });

  } catch (error) {
    console.error('Error creating test lead:', error);
    return NextResponse.json(
      { error: 'Failed to create test lead' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Lead visibility test endpoint',
    instructions: 'POST with agentId and agentName to create a test lead'
  });
}
