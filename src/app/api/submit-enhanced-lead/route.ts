import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin-new';

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
      
      // Contact Information
      agentName: formData.agentName,
      relationship: formData.relationship,
      gamerFirstName: formData.gamerFirstName,
      gamerLastName: formData.gamerLastName,
      email: formData.email,
      phone: formData.phone,
      bestTimeToCall: formData.bestTimeToCall,
      
      // Gaming Profile
      platforms: formData.platforms,
      gamertags: formData.gamertags,
      dailyHours: formData.dailyHours,
      schedule: formData.schedule,
      primaryGames: formData.primaryGames,
      
      // Assessment
      durationOfConcern: formData.durationOfConcern,
      affectedAreas: formData.affectedAreas,
      symptoms: formData.symptoms,
      emergencyIndicators: formData.emergencyIndicators,
      
      // Treatment
      helpType: formData.helpType,
      previousAttempts: formData.previousAttempts,
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
      hasEmergencyIndicators: formData.emergencyIndicators.length > 0,
      totalSymptoms: formData.symptoms.length,
      affectedAreasCount: formData.affectedAreas.length
    };

    // Write to Firestore leads collection
    const docRef = await adminDb.collection('leads').add(leadDocument);

    console.log('Enhanced lead submitted successfully:', {
      documentId: docRef.id,
      agentId: agentId,
      hasEmergencyIndicators: leadDocument.hasEmergencyIndicators,
      totalSymptoms: leadDocument.totalSymptoms
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Enhanced intake form submitted successfully',
      documentId: docRef.id,
      agentId: agentId,
      hasEmergencyIndicators: leadDocument.hasEmergencyIndicators,
      timestamp: leadDocument.submittedAt
    });

  } catch (error) {
    console.error('Enhanced lead submission error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 