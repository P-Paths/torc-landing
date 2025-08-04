import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (!getApps().length) {
    try {
      initializeApp({
        credential: applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel-1fdf3',
      });
    } catch (error) {
      if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
        try {
          initializeApp({
            credential: cert({
              projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel-1fdf3',
              clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
          });
        } catch (certError) {
          console.error('Service account failed:', certError);
          throw certError;
        }
      } else {
        try {
          initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel-1fdf3',
          });
        } catch (fallbackError) {
          console.error('All Firebase initialization methods failed:', fallbackError);
          throw fallbackError;
        }
      }
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Attempting to recover backup data...');
    
    // Initialize Firebase Admin SDK
    initializeFirebaseAdmin();
    const adminDb = getFirestore();
    
    // Get backup data from request (this would normally come from localStorage on client)
    const url = new URL(request.url);
    const backupData = url.searchParams.get('backupData');
    
    if (!backupData) {
      return NextResponse.json({
        success: false,
        error: 'No backup data provided',
        message: 'Please provide backup data to recover'
      }, { status: 400 });
    }
    
    const leads = JSON.parse(backupData);
    console.log(`📦 Found ${leads.length} backup leads to recover`);
    
    const recoveredLeads = [];
    const failedLeads = [];
    
    // Process each backup lead
    for (const lead of leads) {
      try {
        // Remove backup-specific fields
        const { id, backupReason, backupTimestamp, ...cleanLead } = lead;
        
        // Add recovery metadata
        const recoveredLead = {
          ...cleanLead,
          recoveredFromBackup: true,
          originalBackupId: id,
          recoveryTimestamp: new Date().toISOString(),
          recoveryReason: backupReason || 'Unknown'
        };
        
        // Save to Firestore
        const docRef = await adminDb.collection('leads').add(recoveredLead);
        console.log(`✅ Recovered lead: ${docRef.id}`);
        
        recoveredLeads.push({
          originalId: id,
          newId: docRef.id,
          name: `${recoveredLead.gamerFirstName} ${recoveredLead.gamerLastName}`,
          email: recoveredLead.email
        });
        
      } catch (error) {
        console.error(`❌ Failed to recover lead ${lead.id}:`, error);
        failedLeads.push({
          id: lead.id,
          name: `${lead.gamerFirstName} ${lead.gamerLastName}`,
          email: lead.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Data recovery completed`,
      summary: {
        total: leads.length,
        recovered: recoveredLeads.length,
        failed: failedLeads.length
      },
      recoveredLeads,
      failedLeads,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Data recovery failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { backupLeads } = await request.json();
    
    if (!backupLeads || !Array.isArray(backupLeads)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid backup data format',
        message: 'Please provide an array of backup leads'
      }, { status: 400 });
    }
    
    console.log(`🔄 Attempting to recover ${backupLeads.length} leads...`);
    
    // Initialize Firebase Admin SDK
    initializeFirebaseAdmin();
    const adminDb = getFirestore();
    
    const recoveredLeads = [];
    const failedLeads = [];
    
    // Process each backup lead
    for (const lead of backupLeads) {
      try {
        // Remove backup-specific fields
        const { id, backupReason, backupTimestamp, ...cleanLead } = lead;
        
        // Add recovery metadata
        const recoveredLead = {
          ...cleanLead,
          recoveredFromBackup: true,
          originalBackupId: id,
          recoveryTimestamp: new Date().toISOString(),
          recoveryReason: backupReason || 'Unknown'
        };
        
        // Save to Firestore
        const docRef = await adminDb.collection('leads').add(recoveredLead);
        console.log(`✅ Recovered lead: ${docRef.id}`);
        
        recoveredLeads.push({
          originalId: id,
          newId: docRef.id,
          name: `${recoveredLead.gamerFirstName} ${recoveredLead.gamerLastName}`,
          email: recoveredLead.email
        });
        
      } catch (error) {
        console.error(`❌ Failed to recover lead ${lead.id}:`, error);
        failedLeads.push({
          id: lead.id,
          name: `${lead.gamerFirstName} ${lead.gamerLastName}`,
          email: lead.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Data recovery completed`,
      summary: {
        total: backupLeads.length,
        recovered: recoveredLeads.length,
        failed: failedLeads.length
      },
      recoveredLeads,
      failedLeads,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Data recovery failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 