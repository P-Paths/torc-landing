// Firebase Admin SDK Configuration (Server-side only)
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    // Use Application Default Credentials (ADC) with Workload Identity Federation
    // This will automatically use the Vercel service account through WIF
    initializeApp({
      credential: applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel',
    });
    console.log('Firebase Admin initialized with ADC (Workload Identity Federation)');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    
    // Fallback: try with just project ID
    try {
      initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel',
      });
      console.log('Firebase Admin initialized with project ID only (fallback)');
    } catch (fallbackError) {
      console.error('Firebase Admin fallback initialization error:', fallbackError);
      throw fallbackError;
    }
  }
}

// Export Firestore and Auth instances for server-side use
export const adminDb = getFirestore();
export const adminAuth = getAuth(); 