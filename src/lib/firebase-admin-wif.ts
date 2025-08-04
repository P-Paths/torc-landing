// Firebase Admin SDK Configuration with Workload Identity Federation (WIF)
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';

// Get project ID with fallbacks
const getProjectId = () => {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
                   process.env.FIREBASE_ADMIN_PROJECT_ID || 
                   'gaming-funnel-1fdf3';
  
  console.log('🔧 Firebase Project ID:', projectId);
  console.log('🔧 Environment:', process.env.NODE_ENV);
  console.log('🔧 Vercel:', isVercel);
  
  return projectId;
};

if (!getApps().length) {
  try {
    const projectId = getProjectId();
    
    // Always try Application Default Credentials first (most secure)
    try {
      initializeApp({
        credential: applicationDefault(),
        projectId: projectId,
      });
      console.log('✅ Firebase Admin initialized with Application Default Credentials');
    } catch (adcError) {
      console.log('⚠️ ADC failed, trying service account credentials...');
      
      // Fallback to service account credentials if available
      if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
        try {
          initializeApp({
            credential: cert({
              projectId: projectId,
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
            projectId: projectId,
          });
          console.log('✅ Firebase Admin initialized without credential (fallback)');
        } catch (fallbackError) {
          console.error('❌ All Firebase initialization methods failed:', fallbackError);
          
          // Create a mock Firestore instance for development/testing
          console.log('⚠️ Creating mock Firestore instance for development');
          const mockFirestore = {
            collection: (name: string) => ({
              add: async (data: any) => {
                console.log('📝 Mock Firestore: Adding document to', name, data);
                return { id: 'mock-doc-id' };
              },
              doc: (id: string) => ({
                set: async (data: any) => {
                  console.log('📝 Mock Firestore: Setting document', id, 'in', name, data);
                  return { id };
                },
                get: async () => ({
                  exists: true,
                  data: () => ({ mock: true, timestamp: new Date().toISOString() })
                })
              })
            })
          };
          
          // Export mock instances
          (global as any).mockFirestore = mockFirestore;
          (global as any).mockAuth = { verifyIdToken: async () => ({ uid: 'mock-user' }) };
        }
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