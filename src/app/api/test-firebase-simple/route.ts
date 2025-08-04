import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic environment
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? 'SET' : 'NOT SET',
      FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? 'SET' : 'NOT SET',
    };

    // Test Firebase import
    let firebaseStatus = 'Not tested';
    try {
      const { adminDb } = await import('../../../lib/firebase-admin-wif');
      
      // Test a simple write operation
      const testDoc = await adminDb.collection('test').doc('simple-test').set({
        timestamp: new Date().toISOString(),
        test: true,
        message: 'Firebase connection working!'
      });
      
      firebaseStatus = 'SUCCESS';
      
    } catch (firebaseError) {
      firebaseStatus = `ERROR: ${firebaseError instanceof Error ? firebaseError.message : 'Unknown error'}`;
    }

    return NextResponse.json({
      success: true,
      message: 'Environment test completed',
      environment: envInfo,
      firebaseStatus: firebaseStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 