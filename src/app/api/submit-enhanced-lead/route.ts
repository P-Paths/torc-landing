import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    // Simple initialization with just project ID - this should work in Vercel
    initializeApp({
      projectId: 'gaming-funnel',
    });
    console.log('Firebase Admin initialized with project ID only');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // If that fails, try with the environment variable
    try {
      initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gaming-funnel',
      });
      console.log('Firebase Admin initialized with env project ID');
    } catch (fallbackError) {
      console.error('Firebase Admin fallback initialization error:', fallbackError);
      throw fallbackError;
    }
  }
}

const adminDb = getFirestore();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Extract agent ID from URL params or use default
    const url = new URL(request.url);
    const agentId = url.searchParams.get('agent') || 'AHRPE5559';
    
    // Create the Firestore document with all form data and metadata
    const leadDocument = {
      // Agent and submission metadata
      agentId: agentId,
      submittedAt: new Date(),
      timestamp: new Date(),
      
      // Contact Information (handle both naming conventions)
      agentName: formData.agentName || 'Form Referral',
      relationship: formData.relationship || formData.familyMember || 'unknown',
      gamerFirstName: formData.gamerFirstName || formData.firstName || '',
      gamerLastName: formData.gamerLastName || formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      bestTimeToCall: formData.bestTimeToCall || 'anytime',
      
      // Gaming Profile
      platforms: formData.platforms || [],
      gamertags: formData.gamertags || {},
      dailyHours: formData.dailyHours || '',
      schedule: formData.schedule || [],
      primaryGames: formData.primaryGames || formData.games || [],
      
      // Assessment
      durationOfConcern: formData.durationOfConcern || 'unknown',
      affectedAreas: formData.affectedAreas || [],
      symptoms: formData.symptoms || [],
      emergencyIndicators: formData.emergencyIndicators || [],
      
      // Treatment
      helpType: formData.helpType || 'legal_compensation',
      previousAttempts: formData.previousAttempts || [],
      zoomLink: formData.zoomLink || '',
      
      // Status and processing
      status: 'new',
      assessmentScore: null, // Future use for AI assessment
      processedAt: null,
      assignedTo: null,
      notes: [],
      
      // Additional metadata for tracking
      formVersion: 'enhanced-v1',
      submissionSource: 'enhanced-intake-form',
      hasEmergencyIndicators: (formData.emergencyIndicators?.length || 0) > 0,
      totalSymptoms: formData.symptoms?.length || 0,
      affectedAreasCount: formData.affectedAreas?.length || 0,
      
      // Additional form data (if provided)
      additionalData: formData.additionalData || {}
    };

    // Write to Firestore leads collection
    const docRef = await adminDb.collection('leads').add(leadDocument);

    console.log('Enhanced lead submitted successfully:', {
      documentId: docRef.id,
      agentId: agentId,
      hasEmergencyIndicators: leadDocument.hasEmergencyIndicators,
      totalSymptoms: leadDocument.totalSymptoms
    });

    const response = { 
      success: true, 
      message: 'Enhanced intake form submitted successfully',
      documentId: docRef.id,
      agentId: agentId,
      hasEmergencyIndicators: leadDocument.hasEmergencyIndicators,
      timestamp: leadDocument.submittedAt
    };

    console.log('Returning response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Enhanced lead submission error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 