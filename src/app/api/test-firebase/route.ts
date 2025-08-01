import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase-admin';

export async function GET() {
  try {
    // Test Firebase Admin connection
    const testDoc = await adminDb.collection('test').doc('connection').set({
      timestamp: new Date(),
      status: 'Firebase connected successfully!',
      environment: process.env.NODE_ENV
    });

    // Read it back to confirm
    const doc = await adminDb.collection('test').doc('connection').get();
    const data = doc.data();

    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful!',
      data: data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Firebase connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check your Firebase Admin credentials in .env.local'
    }, { status: 500 });
  }
} 