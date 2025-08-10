import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin-wif';

interface Agent {
  id: string;
  name: string;
  agentId: string;
  password: string;
  email?: string;
  phone?: string;
  qrCodeUrl?: string;
  createdAt: Date;
  isActive: boolean;
}

// GET - Fetch specific agent
export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params;
    
    const agentDoc = await adminDb.collection('agents').doc(agentId).get();
    
    if (!agentDoc.exists) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const agentData = agentDoc.data();
    const agent = {
      id: agentDoc.id,
      ...agentData,
      createdAt: agentData?.createdAt?.toDate?.() || agentData?.createdAt
    };

    return NextResponse.json({ agent });
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
  }
}

// PUT - Update specific agent
export async function PUT(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params;
    const body = await request.json();
    const { name, agentId: newAgentId, password, email, phone, isActive, qrCodeUrl } = body;

    const updateData: Partial<Agent> = {};
    if (name) updateData.name = name;
    if (newAgentId) updateData.agentId = newAgentId;
    if (password) updateData.password = password;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (qrCodeUrl) updateData.qrCodeUrl = qrCodeUrl;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    await adminDb.collection('agents').doc(agentId).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}

// DELETE - Delete specific agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params;

    await adminDb.collection('agents').doc(agentId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }
} 