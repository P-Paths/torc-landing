// Firebase Admin SDK Configuration (Server-side only)
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    // First, try to initialize with just project ID (works in some Vercel environments)
    initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel',
    });
    console.log('Firebase Admin initialized with project ID only');
  } catch (error) {
    console.log('Project ID only failed, trying service account credentials...');
    
    // If that fails, try service account credentials
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      try {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
        console.log('Firebase Admin initialized with service account credentials');
      } catch (certError) {
        console.error('Service account credentials failed:', certError);
        throw certError;
      }
    } else {
      // Last resort - try ADC (won't work in Vercel but worth trying)
      try {
        initializeApp({
          credential: applicationDefault(),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel',
        });
        console.log('Firebase Admin initialized with ADC');
      } catch (adcError) {
        console.error('ADC failed:', adcError);
        // Final fallback - initialize without credential
        initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel',
        });
        console.log('Firebase Admin initialized without credential (fallback)');
      }
    }
  }
}

// Export Firestore and Auth instances for server-side use
export const adminDb = getFirestore();
export const adminAuth = getAuth(); 