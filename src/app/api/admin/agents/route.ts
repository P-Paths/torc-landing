import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const agentsSnapshot = await adminDb.collection('agents').get();
    const agents = agentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      lastActivity: doc.data().lastActivity?.toDate?.() || doc.data().lastActivity
    }));

    return NextResponse.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({
      error: 'Failed to fetch agents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({
        error: 'Name and email are required'
      }, { status: 400 });
    }

    // Generate agent ID
    const agentId = `AHRPE${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const agentData = {
      id: agentId,
      name,
      email,
      status: 'active',
      createdAt: new Date(),
      lastActivity: new Date(),
      totalLeads: 0
    };

    await adminDb.collection('agents').doc(agentId).set(agentData);

    return NextResponse.json({
      success: true,
      agent: agentData
    });

  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({
      error: 'Failed to create agent',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 