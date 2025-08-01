import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../../lib/firebase-admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { status } = await request.json();
    const { agentId } = await params;

    if (!status || !['active', 'inactive'].includes(status)) {
      return NextResponse.json({
        error: 'Valid status is required (active or inactive)'
      }, { status: 400 });
    }

    await adminDb.collection('agents').doc(agentId).update({
      status,
      lastActivity: new Date()
    });

    return NextResponse.json({
      success: true,
      message: `Agent status updated to ${status}`
    });

  } catch (error) {
    console.error('Error updating agent status:', error);
    return NextResponse.json({
      error: 'Failed to update agent status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 