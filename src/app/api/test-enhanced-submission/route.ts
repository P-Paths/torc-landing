import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin-new';

export async function POST(request: NextRequest) {
  try {
    // Test data that matches the enhanced form structure
    const testFormData = {
      agentName: 'Test Agent',
      relationship: 'parent',
      gamerFirstName: 'Test',
      gamerLastName: 'Gamer',
      email: 'test@example.com',
      phone: '555-123-4567',
      bestTimeToCall: 'afternoon',
      platforms: ['xbox', 'steam'],
      gamertags: {
        xbox: 'TestGamer123',
        steam: 'testuser'
      },
      dailyHours: '4-8 hours',
      schedule: ['Plays late night (past midnight)', 'Gaming interferes with sleep'],
      primaryGames: 'Fortnite, Call of Duty',
      durationOfConcern: '1-2 years',
      affectedAreas: ['School performance/attendance', 'Family relationships'],
      symptoms: ['Lying about gaming time', 'Failed attempts to reduce gaming'],
      emergencyIndicators: [],
      helpType: 'Individual counseling/therapy',
      previousAttempts: ['Restricted internet/gaming access'],
      insurance: 'private'
    };

    // Extract agent ID from URL params or use default
    const url = new URL(request.url);
    const agentId = url.searchParams.get('agent') || 'AHRPE5559';
    
    // Create the Firestore document with test data
    const testDocument = {
      // Agent and submission metadata
      agentId: agentId,
      submittedAt: new Date(),
      timestamp: new Date(),
      
      // Contact Information
      agentName: testFormData.agentName,
      relationship: testFormData.relationship,
      gamerFirstName: testFormData.gamerFirstName,
      gamerLastName: testFormData.gamerLastName,
      email: testFormData.email,
      phone: testFormData.phone,
      bestTimeToCall: testFormData.bestTimeToCall,
      
      // Gaming Profile
      platforms: testFormData.platforms,
      gamertags: testFormData.gamertags,
      dailyHours: testFormData.dailyHours,
      schedule: testFormData.schedule,
      primaryGames: testFormData.primaryGames,
      
      // Assessment
      durationOfConcern: testFormData.durationOfConcern,
      affectedAreas: testFormData.affectedAreas,
      symptoms: testFormData.symptoms,
      emergencyIndicators: testFormData.emergencyIndicators,
      
      // Treatment
      helpType: testFormData.helpType,
      previousAttempts: testFormData.previousAttempts,
      insurance: testFormData.insurance,
      
      // Status and processing
      status: 'new',
      assessmentScore: null,
      processedAt: null,
      assignedTo: null,
      notes: [],
      
      // Additional metadata for tracking
      formVersion: 'enhanced-v1',
      submissionSource: 'test-enhanced-submission',
      hasEmergencyIndicators: testFormData.emergencyIndicators.length > 0,
      totalSymptoms: testFormData.symptoms.length,
      affectedAreasCount: testFormData.affectedAreas.length,
      isTestSubmission: true
    };

    // Write to Firestore leads collection
    const docRef = await adminDb.collection('leads').add(testDocument);

    console.log('Test enhanced submission successful:', {
      documentId: docRef.id,
      agentId: agentId,
      hasEmergencyIndicators: testDocument.hasEmergencyIndicators,
      totalSymptoms: testDocument.totalSymptoms
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test enhanced form submission successful',
      documentId: docRef.id,
      agentId: agentId,
      hasEmergencyIndicators: testDocument.hasEmergencyIndicators,
      timestamp: testDocument.submittedAt,
      testData: testFormData
    });

  } catch (error) {
    console.error('Test enhanced submission error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 