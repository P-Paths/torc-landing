import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin-wif';

// Formstack endpoints for different priority levels
const FORMSTACK_ENDPOINTS = {
  PRIORITY_1: 'https://copilot.formstack.com/start-workflow/50291bbb-7b61-4357-b767-178fba36d7ef',
  PRIORITY_2: 'https://copilot.formstack.com/start-workflow/484828b7-d528-4147-8ffa-975f629d0cd8',
  BONUS: 'https://copilot.formstack.com/start-workflow/02a0c4da-0cb8-4bbb-af4a-4bdba28ca78d'
};

// Bonus eligibility criteria
const BONUS_CRITERIA = {
  maxAge: 22,
  requiredPlatform: 'xbox',
  minHours: 1100,
  eligibleGames: ['Call of Duty', 'GTA5', 'Fortnite', 'Minecraft', 'Roblox']
};

interface FormData {
  // Contact Information
  agentName: string;
  relationship: string;
  gamerFirstName: string;
  gamerLastName: string;
  email: string;
  phone: string;
  bestTimeToCall: string;
  
  // Gaming Profile
  platforms: string[];
  gamertags: {
    xbox?: string;
    playstation?: string;
    steam?: string;
  };
  dailyHours: string;
  schedule: string[];
  primaryGames: string[];
  
  // Assessment
  durationOfConcern: string;
  affectedAreas: string[];
  symptoms: string[];
  emergencyIndicators: string[];
  
  // Treatment
  helpType: string;
  previousAttempts: string[];
  zoomLink: string;
  
  // Additional fields for law firm submission
  age?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  additionalData?: any;
}

function checkBonusEligibility(formData: FormData): boolean {
  // Check age (if provided)
  if (formData.age && formData.age > BONUS_CRITERIA.maxAge) {
    return false;
  }
  
  // Check if Xbox user
  if (!formData.platforms.includes('xbox')) {
    return false;
  }
  
  // Check gaming hours (estimate from daily hours)
  const dailyHoursMap: { [key: string]: number } = {
    'Less than 2 hours': 1,
    '2-4 hours': 3,
    '4-8 hours': 6,
    '8-12 hours': 10,
    'More than 12 hours': 14
  };
  
  const dailyHours = dailyHoursMap[formData.dailyHours] || 0;
  const estimatedTotalHours = dailyHours * 365; // Rough estimate
  
  if (estimatedTotalHours < BONUS_CRITERIA.minHours) {
    return false;
  }
  
  // Check if plays eligible games
  const hasEligibleGame = formData.primaryGames.some(game => 
    BONUS_CRITERIA.eligibleGames.includes(game)
  );
  
  return hasEligibleGame;
}

function determineFormstackEndpoint(formData: FormData): string {
  // Check bonus eligibility first
  if (checkBonusEligibility(formData)) {
    console.log('🎯 BONUS CASE DETECTED - Submitting to bonus endpoint');
    return FORMSTACK_ENDPOINTS.BONUS;
  }
  
  // Random routing: 60% Priority 1, 40% Priority 2
  const random = Math.random();
  const endpoint = random <= 0.6 ? FORMSTACK_ENDPOINTS.PRIORITY_1 : FORMSTACK_ENDPOINTS.PRIORITY_2;
  
  console.log(`🎲 Random routing: ${random <= 0.6 ? 'Priority 1 (60%)' : 'Priority 2 (40%)'}`);
  return endpoint;
}

async function submitToFormstack(formData: FormData, agentId: string, endpoint: string) {
  try {
    // Prepare data for Formstack submission
    const formstackData = {
      // Basic contact info
      'First Name': formData.gamerFirstName,
      'Last Name': formData.gamerLastName,
      'Email': formData.email,
      'Phone': formData.phone,
      
      // Additional contact info
      'Address': formData.address || '',
      'City': formData.city || '',
      'State': formData.state || '',
      'Zip Code': formData.zipCode || '',
      
      // Gaming profile
      'Gaming Platforms': formData.platforms.join(', '),
      'Xbox Gamertag': formData.gamertags.xbox || '',
      'PlayStation PSN': formData.gamertags.playstation || '',
      'Steam Username': formData.gamertags.steam || '',
      'Daily Gaming Hours': formData.dailyHours,
      'Primary Games': formData.primaryGames.join(', '),
      
      // Assessment
      'Duration of Concern': formData.durationOfConcern,
      'Affected Areas': formData.affectedAreas.join(', '),
      'Symptoms': formData.symptoms.join(', '),
      'Emergency Indicators': formData.emergencyIndicators.join(', '),
      
      // Treatment preferences
      'Help Type': formData.helpType,
      'Previous Attempts': formData.previousAttempts.join(', '),
      
      // Agent tracking
      'Agent ID': agentId,
      'Agent Name': formData.agentName,
      'Relationship': formData.relationship,
      'Best Time to Call': formData.bestTimeToCall,
      
      // Metadata
      'Submission Source': 'RTS Funnel v2',
      'Submission Timestamp': new Date().toISOString(),
      'Form Endpoint': endpoint
    };

    console.log('📤 Submitting to Formstack endpoint:', endpoint);
    console.log('📋 Form data prepared:', Object.keys(formstackData).length, 'fields');

    // Submit to Formstack using fetch
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formstackData).toString(),
    });

    if (response.ok) {
      console.log('✅ Formstack submission successful');
      return { success: true, response: await response.text() };
    } else {
      console.error('❌ Formstack submission failed:', response.status, response.statusText);
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }

  } catch (error) {
    console.error('❌ Formstack submission error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json();
    
    // Extract agent ID from URL params or use default
    const url = new URL(request.url);
    const agentId = url.searchParams.get('agent') || 'AHRPE5559';
    
    console.log('🚀 RTS Funnel Submission Started');
    console.log('👤 Agent ID:', agentId);
    console.log('📝 Form data received:', Object.keys(formData).length, 'fields');

    // Determine which Formstack endpoint to use
    const endpoint = determineFormstackEndpoint(formData);
    
    // Create the lead document for Firestore
    const leadDocument = {
      // Agent and submission metadata
      agentId: agentId,
      submittedAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      
      // Contact Information
      agentName: formData.agentName || 'Form Referral',
      relationship: formData.relationship || 'unknown',
      gamerFirstName: formData.gamerFirstName || '',
      gamerLastName: formData.gamerLastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      bestTimeToCall: formData.bestTimeToCall || 'anytime',
      
      // Additional contact info
      address: formData.address || '',
      city: formData.city || '',
      state: formData.state || '',
      zipCode: formData.zipCode || '',
      age: formData.age || null,
      
      // Gaming Profile
      platforms: formData.platforms || [],
      gamertags: formData.gamertags || {},
      dailyHours: formData.dailyHours || '',
      schedule: formData.schedule || [],
      primaryGames: formData.primaryGames || [],
      
      // Assessment
      durationOfConcern: formData.durationOfConcern || 'unknown',
      affectedAreas: formData.affectedAreas || [],
      symptoms: formData.symptoms || [],
      emergencyIndicators: formData.emergencyIndicators || [],
      
      // Treatment
      helpType: formData.helpType || 'legal_compensation',
      previousAttempts: formData.previousAttempts || [],
      zoomLink: formData.zoomLink || '',
      
      // RTS Funnel specific fields
      formstackEndpoint: endpoint,
      isBonusEligible: checkBonusEligibility(formData),
      submissionStatus: 'pending',
      formstackResponse: null,
      
      // Status and processing
      status: 'new',
      assessmentScore: null,
      processedAt: null,
      assignedTo: null,
      notes: [],
      
      // Additional metadata for tracking
      formVersion: 'rts-funnel-v2',
      submissionSource: 'stealth-intake-form',
      hasEmergencyIndicators: (formData.emergencyIndicators?.length || 0) > 0,
      totalSymptoms: formData.symptoms?.length || 0,
      affectedAreasCount: formData.affectedAreas?.length || 0,
      
      // Additional form data
      additionalData: formData.additionalData || {}
    };

    // Save to Firestore first
    let firestoreId = null;
    try {
      const docRef = await adminDb.collection('leads').add(leadDocument);
      firestoreId = docRef.id;
      console.log('✅ Lead saved to Firestore with ID:', firestoreId);
    } catch (firebaseError) {
      console.error('❌ Firebase save failed:', firebaseError);
      // Continue with submission even if Firestore fails
    }

    // Submit to Formstack
    const formstackResult = await submitToFormstack(formData, agentId, endpoint);
    
    // Update Firestore with Formstack response
    if (firestoreId && formstackResult.success) {
      try {
        await adminDb.collection('leads').doc(firestoreId).update({
          submissionStatus: 'completed',
          formstackResponse: formstackResult.response,
          processedAt: new Date().toISOString()
        });
        console.log('✅ Firestore updated with Formstack response');
      } catch (updateError) {
        console.error('❌ Failed to update Firestore with Formstack response:', updateError);
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully to law firm!',
      documentId: firestoreId,
      leadId: firestoreId,
      agentId: agentId,
      endpoint: endpoint,
      isBonusEligible: checkBonusEligibility(formData),
      formstackSuccess: formstackResult.success,
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