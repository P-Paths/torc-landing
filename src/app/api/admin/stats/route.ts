import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      // Use service account credentials for legacy setups
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      // Use Application Default Credentials (ADC) - preferred approach
      initializeApp({
        credential: applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Final fallback - try with just project ID and ADC
    try {
      initializeApp({
        credential: applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } catch (fallbackError) {
      console.error('Firebase Admin fallback initialization error:', fallbackError);
      // Last resort - initialize without credential (will use ADC)
      initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  }
}

const adminDb = getFirestore();

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