// Firebase Admin SDK Configuration (Server-side only)
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    // Use Application Default Credentials (ADC) - recommended approach
    initializeApp({
      credential: applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel-1fdf3',
    });
    console.log('✅ Firebase Admin initialized with Application Default Credentials');
  } catch (error) {
    console.error('❌ ADC initialization failed:', error);
    
    // Fallback to service account credentials if available
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      try {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel-1fdf3',
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
        console.log('✅ Firebase Admin initialized with service account credentials');
      } catch (certError) {
        console.error('❌ Service account credentials failed:', certError);
        throw certError;
      }
    } else {
      // Last resort - initialize without credential (will use ADC)
      try {
        initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel-1fdf3',
        });
        console.log('✅ Firebase Admin initialized without credential (fallback)');
      } catch (fallbackError) {
        console.error('❌ All Firebase initialization methods failed:', fallbackError);
        throw fallbackError;
      }
    }
  }
}

// Export Firestore and Auth instances for server-side use
export const adminDb = getFirestore();
export const adminAuth = getAuth(); 