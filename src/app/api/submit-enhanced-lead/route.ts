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

    // Log the data for debugging
    console.log('=== LEAD SUBMISSION ===');
    console.log('Agent ID:', agentId);
    console.log('Contact Info:', {
      firstName: leadDocument.gamerFirstName,
      lastName: leadDocument.gamerLastName,
      email: leadDocument.email,
      phone: leadDocument.phone
    });

    // Try to save to Firestore using a simple HTTP request
    try {
      const firebaseUrl = `https://firestore.googleapis.com/v1/projects/gaming-funnel-1fdf3/databases/(default)/documents/leads`;
      
      const firebaseResponse = await fetch(firebaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            agentId: { stringValue: leadDocument.agentId },
            submittedAt: { stringValue: leadDocument.submittedAt },
            timestamp: { stringValue: leadDocument.timestamp },
            agentName: { stringValue: leadDocument.agentName },
            relationship: { stringValue: leadDocument.relationship },
            gamerFirstName: { stringValue: leadDocument.gamerFirstName },
            gamerLastName: { stringValue: leadDocument.gamerLastName },
            email: { stringValue: leadDocument.email },
            phone: { stringValue: leadDocument.phone },
            bestTimeToCall: { stringValue: leadDocument.bestTimeToCall },
            status: { stringValue: leadDocument.status },
            formVersion: { stringValue: leadDocument.formVersion },
            submissionSource: { stringValue: leadDocument.submissionSource },
            hasEmergencyIndicators: { booleanValue: leadDocument.hasEmergencyIndicators },
            totalSymptoms: { integerValue: leadDocument.totalSymptoms },
            affectedAreasCount: { integerValue: leadDocument.affectedAreasCount }
          }
        })
      });

      if (firebaseResponse.ok) {
        const firebaseData = await firebaseResponse.json();
        console.log('✅ Lead saved to Firestore:', firebaseData);
        
        return NextResponse.json({
          success: true,
          message: 'Form submitted successfully! Data saved to database.',
          documentId: firebaseData.name?.split('/').pop(),
          leadId: firebaseData.name?.split('/').pop(),
          timestamp: new Date().toISOString()
        });
      } else {
        const errorText = await firebaseResponse.text();
        console.log('❌ Firebase save failed:', firebaseResponse.status, errorText);
        console.log('Full Lead Document:', JSON.stringify(leadDocument, null, 2));
        
        return NextResponse.json({
          success: true,
          message: 'Form submitted successfully! Data logged for processing.',
          leadId: `temp-${Date.now()}`,
          timestamp: new Date().toISOString(),
          debug: {
            agentId: agentId,
            firstName: leadDocument.gamerFirstName,
            lastName: leadDocument.gamerLastName,
            email: leadDocument.email,
            firebaseError: errorText
          }
        });
      }
    } catch (firebaseError) {
      console.log('❌ Firebase error:', firebaseError);
      console.log('Full Lead Document:', JSON.stringify(leadDocument, null, 2));
      
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully! Data logged for processing.',
        leadId: `temp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        debug: {
          agentId: agentId,
          firstName: leadDocument.gamerFirstName,
          lastName: leadDocument.gamerLastName,
          email: leadDocument.email,
          error: firebaseError instanceof Error ? firebaseError.message : 'Unknown Firebase error'
        }
      });
    }

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 