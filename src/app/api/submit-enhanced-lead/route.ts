import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Extract agent ID from URL params or use default
    const url = new URL(request.url);
    const agentId = url.searchParams.get('agent') || 'AHRPE5559';
    
    // Create the lead document with all form data and metadata
    const leadDocument = {
      // Agent and submission metadata
      agentId: agentId,
      submittedAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      
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

    // For now, just return success and log the data
    // We'll implement Firebase saving in the next step
    console.log('Lead document prepared:', leadDocument);

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully! Data logged for processing.',
      leadId: `temp-${Date.now()}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 