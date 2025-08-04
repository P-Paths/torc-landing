// Firebase Admin SDK Configuration with Workload Identity Federation (WIF)
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';

if (!getApps().length) {
  try {
    if (isVercel) {
      // Use Application Default Credentials (ADC) in Vercel
      // This will automatically use Workload Identity Federation if configured
      initializeApp({
        credential: applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel-1fdf3',
      });
      console.log('✅ Firebase Admin initialized with ADC (WIF ready) in Vercel');
    } else {
      // Local development - use ADC or service account
      if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
        // Use service account credentials for local development
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel-1fdf3',
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
        console.log('✅ Firebase Admin initialized with service account credentials (local dev)');
      } else {
        // Fallback to ADC for local development
        initializeApp({
          credential: applicationDefault(),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel-1fdf3',
        });
        console.log('✅ Firebase Admin initialized with ADC (local dev)');
      }
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    throw error;
  }
}

// Export Firestore and Auth instances for server-side use
export const adminDb = getFirestore();
export const adminAuth = getAuth(); 