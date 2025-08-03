import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin-new';

interface Agent {
  id: string;
  name: string;
  agentId: string;
  password: string;
  qrCodeUrl?: string;
  createdAt: Date;
  isActive: boolean;
}

// GET - Fetch all agents
export async function GET() {
  try {
    const agentsSnapshot = await adminDb
      .collection('agents')
      .orderBy('createdAt', 'desc')
      .get();

    const agents = agentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

// POST - Create new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, agentId, password } = body;

    if (!name || !agentId || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if agent ID already exists
    const existingAgent = await adminDb
      .collection('agents')
      .where('agentId', '==', agentId)
      .get();

    if (!existingAgent.empty) {
      return NextResponse.json({ error: 'Agent ID already exists' }, { status: 409 });
    }

    const newAgent: Omit<Agent, 'id'> = {
      name,
      agentId,
      password,
      createdAt: new Date(),
      isActive: true
    };

    const docRef = await adminDb.collection('agents').add(newAgent);

    return NextResponse.json({ 
      id: docRef.id,
      ...newAgent 
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}

// PUT - Update agent
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, agentId, password, isActive, qrCodeUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    const updateData: Partial<Agent> = {};
    if (name) updateData.name = name;
    if (agentId) updateData.agentId = agentId;
    if (password) updateData.password = password;
    if (qrCodeUrl) updateData.qrCodeUrl = qrCodeUrl;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    await adminDb.collection('agents').doc(id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}

// DELETE - Delete agent
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    await adminDb.collection('agents').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }
} 