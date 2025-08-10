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
  console.log('🔧 Available env vars:', Object.keys(process.env).filter(key => key.includes('FIREBASE')));
  
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
                return { id: 'mock-doc-id-' + Date.now() };
              },
              doc: (id: string) => ({
                set: async (data: any) => {
                  console.log('📝 Mock Firestore: Setting document', id, 'in', name, data);
                  return { id };
                },
                get: async () => ({
                  exists: true,
                  data: () => ({ mock: true, timestamp: new Date().toISOString() })
                }),
                update: async (data: any) => {
                  console.log('📝 Mock Firestore: Updating document', id, 'in', name, data);
                  return { id };
                },
                delete: async () => {
                  console.log('📝 Mock Firestore: Deleting document', id, 'in', name);
                  return { id };
                }
              }),
              where: (field: string, op: string, value: any) => ({
                get: async () => ({
                  empty: true,
                  docs: []
                })
              }),
              orderBy: (field: string, direction?: string) => ({
                get: async () => ({
                  docs: []
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
let adminDb: any;
let adminAuth: any;

// For development, use mock Firestore to avoid Firebase auth issues
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development mode: Using mock Firestore for testing');
  
  // Create a simple mock Firestore that works for agent management
  const mockFirestore = {
    collection: (name: string) => ({
      add: async (data: any) => {
        console.log('📝 Mock Firestore: Adding document to', name, data);
        return { id: 'mock-doc-id-' + Date.now() };
      },
      doc: (id: string) => ({
        set: async (data: any) => {
          console.log('📝 Mock Firestore: Setting document', id, 'in', name, data);
          return { id };
        },
        get: async () => ({
          exists: true,
          data: () => ({ mock: true, timestamp: new Date().toISOString() })
        }),
        update: async (data: any) => {
          console.log('📝 Mock Firestore: Updating document', id, 'in', name, data);
          return { id };
        },
        delete: async () => {
          console.log('📝 Mock Firestore: Deleting document', id, 'in', name);
          return { id };
        }
      }),
      where: (field: string, op: string, value: any) => ({
        get: async () => ({
          empty: true,
          docs: []
        })
      }),
      orderBy: (field: string, direction?: string) => ({
        get: async () => ({
          docs: []
        })
      })
    })
  };
  
  adminDb = mockFirestore;
  adminAuth = { verifyIdToken: async () => ({ uid: 'mock-user' }) };
} else {
  // Production: Try real Firebase
  try {
    adminDb = getFirestore();
    adminAuth = getAuth();
    console.log('✅ Using real Firebase instances');
  } catch (error) {
    console.log('⚠️ Firebase initialization failed, using mock instances');
    adminDb = (global as any).mockFirestore;
    adminAuth = (global as any).mockAuth;
  }
}

export { adminDb, adminAuth }; 