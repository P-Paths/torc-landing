import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple test that just checks if the environment variables are set correctly
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing environment variables: ${missingVars.join(', ')}`,
        details: 'Check your .env.local file for Firebase client configuration'
      }, { status: 500 });
    }

    // Test admin SDK variables (optional for now)
    const adminVars = [
      'FIREBASE_ADMIN_PROJECT_ID',
      'FIREBASE_ADMIN_CLIENT_EMAIL',
      'FIREBASE_ADMIN_PRIVATE_KEY'
    ];

    const missingAdminVars = adminVars.filter(varName => !process.env[varName]);
    const adminConfigured = missingAdminVars.length === 0;

    return NextResponse.json({
      success: true,
      message: 'Firebase environment variables configured!',
      clientSDK: '✅ Ready',
      adminSDK: adminConfigured ? '✅ Ready' : `⚠️ Missing: ${missingAdminVars.join(', ')}`,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Firebase test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Error checking Firebase configuration'
    }, { status: 500 });
  }
} 