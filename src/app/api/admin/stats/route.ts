import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Get leads collection
    const leadsSnapshot = await adminDb.collection('leads').get();
    const leads = leadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get agents collection
    const agentsSnapshot = await adminDb.collection('agents').get();
    const agents = agentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calculate stats
    const totalLeads = leads.length;
    const totalAgents = agents.length;
    const activeAgents = agents.filter((agent: any) => agent.status === 'active').length;
    const emergencyLeads = leads.filter((lead: any) => lead.hasEmergencyIndicators).length;
    const recentLeads = leads.filter((lead: any) => {
      const leadDate = new Date(lead.submittedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return leadDate >= weekAgo;
    }).length;

    // Calculate average symptoms
    const totalSymptoms = leads.reduce((sum, lead: any) => sum + (lead.totalSymptoms || 0), 0);
    const averageSymptoms = totalLeads > 0 ? totalSymptoms / totalLeads : 0;

    return NextResponse.json({
      totalLeads,
      totalAgents,
      activeAgents,
      emergencyLeads,
      recentLeads,
      averageSymptoms
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({
      error: 'Failed to fetch stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 