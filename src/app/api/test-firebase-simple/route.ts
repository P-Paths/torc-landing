import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Test 1: Write a test document
    console.log('📝 Writing test document...');
    const testDoc = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase connection test successful',
      environment: process.env.NODE_ENV || 'development'
    };
    
    const docRef = await adminDb.collection('test').add(testDoc);
    console.log('✅ Test document written with ID:', docRef.id);
    
    // Test 2: Read the document back
    console.log('📖 Reading test document...');
    const docSnap = await adminDb.collection('test').doc(docRef.id).get();
    
    if (docSnap.exists) {
      console.log('✅ Test document read successfully');
      
      // Test 3: Clean up - delete the test document
      await adminDb.collection('test').doc(docRef.id).delete();
      console.log('✅ Test document cleaned up');
      
      return NextResponse.json({
        success: true,
        message: 'Firebase connection test successful!',
        documentId: docRef.id,
        data: docSnap.data(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    } else {
      throw new Error('Test document not found after writing');
    }
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      debug: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasPrivateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
        hasClientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL
      }
    }, { status: 500 });
  }
} 