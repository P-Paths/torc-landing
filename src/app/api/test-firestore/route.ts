import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Test data as specified in the mission brief
    const testLead = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      agent: 'AHRPE5559',
      gamerTag: 'fortniteQueen91',
      platform: 'Xbox',
      timestamp: new Date()
    };

    // Debug: Check if Firebase Admin is initialized
    console.log('Firebase Admin initialized:', !!adminDb);
    console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    console.log('Environment:', process.env.NODE_ENV);

    // Write to Firestore leads collection
    const docRef = await adminDb.collection('leads').add(testLead);

    return NextResponse.json({ 
      success: true, 
      message: 'Test lead written to Firestore successfully using Workload Identity Federation',
      documentId: docRef.id,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      environment: process.env.NODE_ENV,
      authMethod: 'Workload Identity Federation'
    });

  } catch (error) {
    console.error('Firestore test error:', error);
    
    // Provide helpful error information
    const errorInfo = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        authMethod: 'Workload Identity Federation',
        note: 'Run "gcloud auth application-default login" to authenticate locally'
      }
    };
    
    return NextResponse.json(errorInfo, { status: 500 });
  }
}

export async function GET() {
  try {
    // Test reading from Firestore
    const snapshot = await adminDb.collection('leads').limit(5).get();
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully read from Firestore using Workload Identity Federation',
      leads: leads,
      count: leads.length,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      authMethod: 'Workload Identity Federation'
    });

  } catch (error) {
    console.error('Firestore read test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        environment: process.env.NODE_ENV,
        authMethod: 'Workload Identity Federation'
      },
      { status: 500 }
    );
  }
} 