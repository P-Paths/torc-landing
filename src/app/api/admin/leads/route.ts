import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
}

const adminDb = getFirestore();

export async function GET(request: NextRequest) {
  try {
    const leadsSnapshot = await adminDb.collection('leads')
      .orderBy('submittedAt', 'desc')
      .limit(50)
      .get();

    const leads = leadsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        agentId: data.agentId || '',
        agentName: data.agentName || '',
        gamerFirstName: data.gamerFirstName || '',
        gamerLastName: data.gamerLastName || '',
        email: data.email || '',
        phone: data.phone || '',
        status: data.status || 'new',
        submittedAt: data.submittedAt?.toDate?.() || data.submittedAt || new Date(),
        hasEmergencyIndicators: data.hasEmergencyIndicators || false,
        totalSymptoms: data.totalSymptoms || 0,
        // Add additional fields for enhanced display
        platforms: data.platforms || [],
        gamertags: data.gamertags || {},
        dailyHours: data.dailyHours || '',
        symptoms: data.symptoms || [],
        emergencyIndicators: data.emergencyIndicators || [],
        affectedAreas: data.affectedAreas || [],
        helpType: data.helpType || '',
        insurance: data.insurance || '',
        bestTimeToCall: data.bestTimeToCall || ''
      };
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({
      error: 'Failed to fetch leads',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 